// ============================================================
// XERON Engine — Unity Editor Plugin
// Window -> XERON Engine
// Version: 7.0.0
// ============================================================
using UnityEngine;
using UnityEditor;
using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

[System.Serializable]
public class ConnectResponse {
    public string token;
    public string platform;
    public UserInfo user;
}

[System.Serializable]
public class UserInfo {
    public string email;
    public string plan;
    public int credits;
    public string username;
}

[System.Serializable]
public class PendingInsertion {
    public string id;
    public string code;
    public string language;
    public string project_name;
    public string status;
}

[System.Serializable]
public class PendingResponse {
    public PendingInsertion[] insertions;
}

[System.Serializable]
public class GenerateRequest {
    public string prompt;
    public string mode;
    public string platform;
    public string quality;
}

[System.Serializable]
public class GenerateResponse {
    public string projectId;
    public string code;
    public string error;
    public int required;
    public int current;
}

public class XeronPlugin : EditorWindow
{
    private const string BASE_URL = "https://www.xeron-labs.com";
    private const string SESSION_KEY = "XeronSessionToken";
    private const string GENERATED_FOLDER = "Assets/XeronGenerated";

    // State
    private enum Screen { Connect, Home, Generate, Progress, Result }
    private Screen currentScreen = Screen.Connect;

    // Connection
    private string connectionCode = "";
    private bool isConnecting = false;
    private string connectError = "";

    // User
    private string sessionToken = "";
    private UserInfo currentUser = null;

    // Generation
    private string prompt = "";
    private string selectedMode = "script";
    private bool isGenerating = false;
    private string generationError = "";
    private string generationResult = "";
    private string projectId = "";
    private float generationProgress = 0f;

    // Polling
    private double lastPollTime = 0;
    private double lastPendingCheck = 0;

    private static readonly string[] MODES = { "script", "ui", "fix", "clean", "diagnose" };
    private static readonly string[] MODE_LABELS = { "C# Script", "UI Component", "Fix Code", "Clean Project", "Diagnose" };

    private Vector2 scrollPos;
    private GUIStyle headerStyle;
    private GUIStyle subStyle;
    private GUIStyle codeStyle;
    private bool stylesInitialized = false;

    [MenuItem("Window/XERON Engine")]
    public static void ShowWindow()
    {
        var w = GetWindow<XeronPlugin>("XERON Engine");
        w.minSize = new Vector2(380, 520);
        w.maxSize = new Vector2(600, 900);
    }

    private void OnEnable()
    {
        sessionToken = EditorPrefs.GetString(SESSION_KEY, "");
        if (!string.IsNullOrEmpty(sessionToken))
        {
            currentScreen = Screen.Home;
            LoadUserInfo();
        }
        EditorApplication.update += OnEditorUpdate;
    }

    private void OnDisable()
    {
        EditorApplication.update -= OnEditorUpdate;
    }

    private void OnEditorUpdate()
    {
        double now = EditorApplication.timeSinceStartup;

        // Poll generation status
        if (currentScreen == Screen.Progress && !string.IsNullOrEmpty(projectId))
        {
            if (now - lastPollTime > 2.0)
            {
                lastPollTime = now;
                PollGenerationStatus();
            }
        }

        // Poll pending insertions
        if (!string.IsNullOrEmpty(sessionToken) && (currentScreen == Screen.Home || currentScreen == Screen.Result))
        {
            if (now - lastPendingCheck > 3.0)
            {
                lastPendingCheck = now;
                CheckPendingInsertions();
            }
        }
    }

    private void InitStyles()
    {
        if (stylesInitialized) return;
        stylesInitialized = true;

        headerStyle = new GUIStyle(EditorStyles.boldLabel)
        {
            fontSize = 18,
            normal = { textColor = new Color(0.4f, 0.7f, 1f) },
            alignment = TextAnchor.MiddleCenter,
        };

        subStyle = new GUIStyle(EditorStyles.label)
        {
            fontSize = 11,
            normal = { textColor = new Color(0.6f, 0.7f, 0.8f) },
            wordWrap = true,
        };

        codeStyle = new GUIStyle(EditorStyles.textArea)
        {
            font = (Font)Resources.Load("Fonts/JetBrainsMono") ?? EditorStyles.textArea.font,
            fontSize = 11,
            normal = { textColor = new Color(0.75f, 0.85f, 1f) },
        };
    }

    void OnGUI()
    {
        InitStyles();

        // Header
        EditorGUILayout.Space(12);
        GUILayout.Label("◆ XERON Engine", headerStyle);
        EditorGUILayout.Space(4);

        if (currentUser != null)
        {
            GUILayout.Label($"Unity · {currentUser.email} · {currentUser.plan} · 🪙 {currentUser.credits}", subStyle);
        }

        EditorGUILayout.Space(12);
        DrawDivider();
        EditorGUILayout.Space(8);

        switch (currentScreen)
        {
            case Screen.Connect:    DrawConnectScreen(); break;
            case Screen.Home:       DrawHomeScreen();    break;
            case Screen.Generate:   DrawGenerateScreen();break;
            case Screen.Progress:   DrawProgressScreen();break;
            case Screen.Result:     DrawResultScreen();  break;
        }
    }

    // ── Connect Screen ──────────────────────────────────────────────────────────
    void DrawConnectScreen()
    {
        GUILayout.Label("Connect to XERON", EditorStyles.boldLabel);
        EditorGUILayout.Space(4);
        GUILayout.Label("1. Go to xeron-labs.com/dashboard/unity\n2. Click 'Connect Studio'\n3. Enter the 6-character code below", subStyle);
        EditorGUILayout.Space(12);

        GUILayout.Label("Connection Code:", EditorStyles.boldLabel);
        connectionCode = EditorGUILayout.TextField(connectionCode).ToUpper();

        EditorGUILayout.Space(8);

        if (!string.IsNullOrEmpty(connectError))
        {
            EditorGUILayout.HelpBox(connectError, MessageType.Error);
            EditorGUILayout.Space(4);
        }

        using (new EditorGUI.DisabledScope(isConnecting || connectionCode.Length < 6))
        {
            if (GUILayout.Button(isConnecting ? "Connecting..." : "Connect", GUILayout.Height(36)))
            {
                ConnectWithCode(connectionCode);
            }
        }

        EditorGUILayout.Space(8);
        GUILayout.Label("Your code expires after 10 minutes. Generate a new one on the website.", subStyle);
    }

    // ── Home Screen ─────────────────────────────────────────────────────────────
    void DrawHomeScreen()
    {
        GUILayout.Label("AI Modes", EditorStyles.boldLabel);
        EditorGUILayout.Space(6);

        for (int i = 0; i < MODES.Length; i++)
        {
            if (GUILayout.Button(MODE_LABELS[i], GUILayout.Height(32)))
            {
                selectedMode = MODES[i];
                prompt = "";
                generationResult = "";
                generationError = "";
                currentScreen = Screen.Generate;
            }
            EditorGUILayout.Space(2);
        }

        DrawDivider();
        EditorGUILayout.Space(8);

        if (GUILayout.Button("Sign Out", GUILayout.Height(28)))
        {
            EditorPrefs.DeleteKey(SESSION_KEY);
            sessionToken = "";
            currentUser = null;
            currentScreen = Screen.Connect;
        }
    }

    // ── Generate Screen ─────────────────────────────────────────────────────────
    void DrawGenerateScreen()
    {
        if (GUILayout.Button("← Back", GUILayout.Width(80))) { currentScreen = Screen.Home; return; }
        EditorGUILayout.Space(8);

        int modeIdx = Array.IndexOf(MODES, selectedMode);
        GUILayout.Label(modeIdx >= 0 ? MODE_LABELS[modeIdx] : "Generate", EditorStyles.boldLabel);
        EditorGUILayout.Space(6);

        string placeholder = selectedMode switch {
            "script"   => "Describe the script... e.g. 'A player movement controller with jump and sprint'",
            "ui"       => "Describe the UI... e.g. 'A main menu with Play, Settings, Quit buttons'",
            "fix"      => "Paste your broken C# code and describe the error...",
            "clean"    => "Paste your code to clean and organize...",
            "diagnose" => "Describe the issue or paste the problematic script...",
            _          => "Describe what you need..."
        };

        GUILayout.Label(prompt.Length == 0 ? placeholder : "Prompt:", subStyle);
        prompt = EditorGUILayout.TextArea(prompt, GUILayout.Height(120));

        EditorGUILayout.Space(8);

        if (!string.IsNullOrEmpty(generationError))
        {
            EditorGUILayout.HelpBox(generationError, MessageType.Error);
            EditorGUILayout.Space(4);
        }

        using (new EditorGUI.DisabledScope(isGenerating || string.IsNullOrWhiteSpace(prompt)))
        {
            if (GUILayout.Button(isGenerating ? "Starting..." : "Generate →", GUILayout.Height(36)))
            {
                StartGeneration();
            }
        }
    }

    // ── Progress Screen ─────────────────────────────────────────────────────────
    void DrawProgressScreen()
    {
        GUILayout.Label("Generating...", EditorStyles.boldLabel);
        EditorGUILayout.Space(8);

        Rect progressRect = EditorGUILayout.GetControlRect(false, 20);
        EditorGUI.ProgressBar(progressRect, generationProgress, $"{(int)(generationProgress * 100)}%");

        EditorGUILayout.Space(8);
        GUILayout.Label("AI is writing your C# code. This usually takes 10-30 seconds.", subStyle);
        EditorGUILayout.Space(12);

        if (GUILayout.Button("Cancel", GUILayout.Height(28)))
        {
            projectId = "";
            generationProgress = 0f;
            currentScreen = Screen.Generate;
        }

        Repaint();
    }

    // ── Result Screen ────────────────────────────────────────────────────────────
    void DrawResultScreen()
    {
        if (GUILayout.Button("← Back to Home", GUILayout.Width(120))) { currentScreen = Screen.Home; return; }
        EditorGUILayout.Space(8);

        GUILayout.Label("Generated Code", EditorStyles.boldLabel);
        EditorGUILayout.Space(4);

        scrollPos = EditorGUILayout.BeginScrollView(scrollPos, GUILayout.Height(300));
        EditorGUILayout.TextArea(generationResult, codeStyle, GUILayout.ExpandHeight(true));
        EditorGUILayout.EndScrollView();

        EditorGUILayout.Space(8);

        EditorGUILayout.BeginHorizontal();
        if (GUILayout.Button("Insert into Project", GUILayout.Height(36)))
        {
            InsertCodeToProject(generationResult, $"Xeron_{selectedMode}");
        }
        if (GUILayout.Button("Copy", GUILayout.Height(36), GUILayout.Width(80)))
        {
            GUIUtility.systemCopyBuffer = generationResult;
            ShowNotification(new GUIContent("Copied!"));
        }
        EditorGUILayout.EndHorizontal();
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    private async void ConnectWithCode(string code)
    {
        isConnecting = true;
        connectError = "";
        Repaint();

        try
        {
            using var client = new HttpClient();
            var body = new { code = code.ToUpper() };
            var json = JsonUtility.ToJson(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync($"{BASE_URL}/api/plugin/connect", content);
            var responseText = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var data = JsonUtility.FromJson<ConnectResponse>(responseText);
                sessionToken = data.token;
                currentUser = data.user;
                EditorPrefs.SetString(SESSION_KEY, sessionToken);
                currentScreen = Screen.Home;
            }
            else
            {
                var errorData = JsonUtility.FromJson<GenerateResponse>(responseText);
                connectError = errorData?.error ?? "Connection failed";
            }
        }
        catch (Exception e)
        {
            connectError = "Network error: " + e.Message;
        }
        finally
        {
            isConnecting = false;
            Repaint();
        }
    }

    private async void LoadUserInfo()
    {
        try
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {sessionToken}");
            var response = await client.GetAsync($"{BASE_URL}/api/plugin/projects");
            if (!response.IsSuccessStatusCode)
            {
                // Session invalid — go back to connect
                sessionToken = "";
                EditorPrefs.DeleteKey(SESSION_KEY);
                currentScreen = Screen.Connect;
                Repaint();
            }
        }
        catch { }
    }

    private async void StartGeneration()
    {
        isGenerating = true;
        generationError = "";
        generationProgress = 0.1f;
        currentScreen = Screen.Progress;
        Repaint();

        try
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {sessionToken}");

            var requestBody = JsonUtility.ToJson(new GenerateRequest
            {
                prompt = prompt,
                mode = selectedMode,
                platform = "unity",
                quality = "standard",
            });

            var content = new StringContent(requestBody, Encoding.UTF8, "application/json");
            var response = await client.PostAsync($"{BASE_URL}/api/generate", content);
            var responseText = await response.Content.ReadAsStringAsync();
            var data = JsonUtility.FromJson<GenerateResponse>(responseText);

            if (response.IsSuccessStatusCode)
            {
                if (!string.IsNullOrEmpty(data.code))
                {
                    generationResult = data.code;
                    generationProgress = 1f;
                    currentScreen = Screen.Result;
                }
                else if (!string.IsNullOrEmpty(data.projectId))
                {
                    projectId = data.projectId;
                    generationProgress = 0.3f;
                }
            }
            else
            {
                generationError = data?.error ?? "Generation failed";
                currentScreen = Screen.Generate;
            }
        }
        catch (Exception e)
        {
            generationError = "Network error: " + e.Message;
            currentScreen = Screen.Generate;
        }
        finally
        {
            isGenerating = false;
            Repaint();
        }
    }

    private async void PollGenerationStatus()
    {
        try
        {
            using var client = new HttpClient();
            var response = await client.GetAsync($"{BASE_URL}/api/generate/status?id={projectId}");
            var responseText = await response.Content.ReadAsStringAsync();
            var data = JsonUtility.FromJson<GenerateResponse>(responseText);

            if (!string.IsNullOrEmpty(data.code))
            {
                generationResult = data.code;
                generationProgress = 1f;
                projectId = "";
                currentScreen = Screen.Result;
                Repaint();
            }
            else
            {
                generationProgress = Mathf.Min(generationProgress + 0.05f, 0.9f);
                Repaint();
            }
        }
        catch { }
    }

    private async void CheckPendingInsertions()
    {
        if (string.IsNullOrEmpty(sessionToken)) return;
        try
        {
            using var client = new HttpClient();
            var response = await client.GetAsync($"{BASE_URL}/api/plugin/pending?token={sessionToken}");
            if (!response.IsSuccessStatusCode) return;

            var responseText = await response.Content.ReadAsStringAsync();
            var data = JsonUtility.FromJson<PendingResponse>(responseText);

            if (data?.insertions == null) return;

            foreach (var insertion in data.insertions)
            {
                InsertCodeToProject(insertion.code, insertion.project_name ?? $"Xeron_{insertion.language}");
                await ConfirmInsertion(insertion.id);
            }
        }
        catch { }
    }

    private async Task ConfirmInsertion(string insertionId)
    {
        try
        {
            using var client = new HttpClient();
            var body = JsonUtility.ToJson(new { insertionId, token = sessionToken });
            await client.PostAsync($"{BASE_URL}/api/plugin/pending", new StringContent(body, Encoding.UTF8, "application/json"));
        }
        catch { }
    }

    private void InsertCodeToProject(string code, string fileName)
    {
        try
        {
            if (!Directory.Exists(GENERATED_FOLDER))
            {
                Directory.CreateDirectory(GENERATED_FOLDER);
                AssetDatabase.Refresh();
            }

            string safeFileName = System.Text.RegularExpressions.Regex.Replace(fileName, @"[^\w\-]", "_");
            string path = $"{GENERATED_FOLDER}/{safeFileName}.cs";

            // Avoid collision
            int counter = 1;
            while (File.Exists(path))
            {
                path = $"{GENERATED_FOLDER}/{safeFileName}_{counter}.cs";
                counter++;
            }

            File.WriteAllText(path, code);
            AssetDatabase.Refresh();

            Debug.Log($"[XERON] Inserted: {path}");
            ShowNotification(new GUIContent($"Inserted: {safeFileName}.cs"));
        }
        catch (Exception e)
        {
            Debug.LogError($"[XERON] Insert failed: {e.Message}");
        }
    }

    private void DrawDivider()
    {
        var rect = EditorGUILayout.GetControlRect(false, 1);
        EditorGUI.DrawRect(rect, new Color(0.3f, 0.4f, 0.5f, 0.3f));
    }
}
