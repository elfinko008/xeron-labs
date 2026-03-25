-- ============================================================
-- XERON Engine — Roblox Studio Plugin
-- Version: 1.0.0
-- Website: https://xeron-labs.com
-- ============================================================

local BASE_URL = "https://xeron-labs.com"
local PLUGIN_NAME = "XERON Engine"
local SETTING_TOKEN = "xeron_session_token"

local HttpService    = game:GetService("HttpService")
local StudioService  = game:GetService("StudioService")
local RunService     = game:GetService("RunService")

-- Nur im Studio ausführen
if not RunService:IsStudio() then return end

-- ============================================================
-- PLUGIN TOOLBAR & BUTTON
-- ============================================================
local toolbar = plugin:CreateToolbar(PLUGIN_NAME)
local toggleButton = toolbar:CreateButton(
    "XERON Engine",
    "KI-generierte Roblox-Spiele laden",
    "rbxassetid://0" -- Platzhalter Icon
)

-- ============================================================
-- DOCK WIDGET
-- ============================================================
local widgetInfo = DockWidgetPluginGuiInfo.new(
    Enum.InitialDockState.Right,
    false, -- initial enabled
    false, -- override enabled
    300,   -- default width
    500,   -- default height
    280,   -- min width
    400    -- min height
)

local widget = plugin:CreateDockWidgetPluginGui(PLUGIN_NAME, widgetInfo)
widget.Title = PLUGIN_NAME
widget.Name  = PLUGIN_NAME

-- ============================================================
-- HELPER FUNKTIONEN
-- ============================================================
local function getToken()
    return plugin:GetSetting(SETTING_TOKEN) or ""
end

local function saveToken(token)
    plugin:SetSetting(SETTING_TOKEN, token)
end

local function clearToken()
    plugin:SetSetting(SETTING_TOKEN, "")
end

local function apiRequest(method, endpoint, body)
    local token = getToken()
    local headers = {
        ["Content-Type"]  = "application/json",
        ["X-Session-Token"] = token,
    }

    local success, result = pcall(function()
        return HttpService:RequestAsync({
            Url     = BASE_URL .. endpoint,
            Method  = method,
            Headers = headers,
            Body    = body and HttpService:JSONEncode(body) or nil,
        })
    end)

    if not success then
        return nil, "Netzwerkfehler: " .. tostring(result)
    end

    if result.StatusCode == 401 then
        clearToken()
        return nil, "Nicht authentifiziert"
    end

    local ok, data = pcall(HttpService.JSONDecode, HttpService, result.Body)
    if not ok then
        return nil, "Ungültige Serverantwort"
    end

    return data, nil
end

-- ============================================================
-- UI FARBEN & STILHELFER
-- ============================================================
local COLORS = {
    bg        = Color3.fromRGB(10,  10,  20),
    surface   = Color3.fromRGB(18,  18,  31),
    card      = Color3.fromRGB(26,  26,  46),
    red       = Color3.fromRGB(233, 69,  96),
    cyan      = Color3.fromRGB(0,   212, 255),
    white     = Color3.fromRGB(255, 255, 255),
    secondary = Color3.fromRGB(160, 160, 184),
    muted     = Color3.fromRGB(96,  96,  120),
    border    = Color3.fromRGB(42,  42,  62),
    green     = Color3.fromRGB(0,   255, 128),
}

local function makeFrame(parent, size, pos, bg, radius)
    local f = Instance.new("Frame")
    f.Size            = size or UDim2.new(1,0,0,40)
    f.Position        = pos  or UDim2.new(0,0,0,0)
    f.BackgroundColor3 = bg or COLORS.surface
    f.BorderSizePixel = 0
    f.Parent          = parent
    if radius then
        local corner = Instance.new("UICorner")
        corner.CornerRadius = UDim.new(0, radius)
        corner.Parent = f
    end
    return f
end

local function makeLabel(parent, text, size, color, pos)
    local l = Instance.new("TextLabel")
    l.Text              = text
    l.TextSize          = size or 14
    l.TextColor3        = color or COLORS.white
    l.BackgroundTransparency = 1
    l.Font              = Enum.Font.GothamBold
    l.TextXAlignment    = Enum.TextXAlignment.Left
    l.Size              = UDim2.new(1, -20, 0, size and size + 6 or 20)
    l.Position          = pos or UDim2.new(0, 10, 0, 0)
    l.Parent            = parent
    return l
end

local function makeInput(parent, placeholder, pos, height, isPassword)
    local frame = makeFrame(parent, UDim2.new(1, -20, 0, height or 36), pos, COLORS.card, 8)
    local stroke = Instance.new("UIStroke")
    stroke.Color = COLORS.border
    stroke.Thickness = 1
    stroke.Parent = frame

    local box = Instance.new("TextBox")
    box.Size                  = UDim2.new(1, -16, 1, 0)
    box.Position              = UDim2.new(0, 8, 0, 0)
    box.BackgroundTransparency = 1
    box.Text                  = ""
    box.PlaceholderText       = placeholder
    box.PlaceholderColor3     = COLORS.muted
    box.TextColor3            = COLORS.white
    box.Font                  = Enum.Font.Gotham
    box.TextSize              = 13
    box.ClearTextOnFocus      = false
    box.TextXAlignment        = Enum.TextXAlignment.Left
    if isPassword then
        box.TextTransparency  = 0
        -- Roblox Studio hat kein nativ Passwortfeld, Hinweis
    end
    box.Parent = frame

    box.Focused:Connect(function()
        stroke.Color = COLORS.red
    end)
    box.FocusLost:Connect(function()
        stroke.Color = COLORS.border
    end)

    return frame, box
end

local function makeButton(parent, text, pos, size, primary)
    local btn = Instance.new("TextButton")
    btn.Text              = text
    btn.Size              = size or UDim2.new(1, -20, 0, 36)
    btn.Position          = pos  or UDim2.new(0, 10, 0, 0)
    btn.BackgroundColor3  = primary and COLORS.red or COLORS.surface
    btn.TextColor3        = COLORS.white
    btn.Font              = Enum.Font.GothamBold
    btn.TextSize          = 13
    btn.BorderSizePixel   = 0
    btn.AutoButtonColor   = false
    btn.Parent            = parent
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 8)
    corner.Parent = btn
    local stroke = Instance.new("UIStroke")
    stroke.Color = primary and Color3.fromRGB(255,100,130) or COLORS.border
    stroke.Thickness = 1
    stroke.Parent = btn

    btn.MouseEnter:Connect(function()
        btn.BackgroundColor3 = primary and Color3.fromRGB(240,80,112) or COLORS.card
    end)
    btn.MouseLeave:Connect(function()
        btn.BackgroundColor3 = primary and COLORS.red or COLORS.surface
    end)

    return btn
end

-- ============================================================
-- HAUPT-CONTAINER
-- ============================================================
local mainFrame = makeFrame(widget, UDim2.new(1,0,1,0), UDim2.new(0,0,0,0), COLORS.bg)

-- SCREEN MANAGER
local screens = {}
local currentScreen = nil

local function showScreen(name)
    for n, s in pairs(screens) do
        s.Visible = (n == name)
    end
    currentScreen = name
end

-- ============================================================
-- SCREEN 1: LOGIN
-- ============================================================
local loginScreen = makeFrame(mainFrame, UDim2.new(1,0,1,0), UDim2.new(0,0,0,0), COLORS.bg)
loginScreen.Visible = true
screens["login"] = loginScreen

-- Logo
local logoLabel = makeLabel(loginScreen, "XERON Engine", 20, COLORS.red, UDim2.new(0,10,0,20))
logoLabel.Font = Enum.Font.GothamBlack
logoLabel.Size = UDim2.new(1,-20,0,28)
local subLabel = makeLabel(loginScreen, "KI-Roblox-Spielgenerierung", 11, COLORS.muted, UDim2.new(0,10,0,52))

-- Divider
local div1 = makeFrame(loginScreen, UDim2.new(1,-20,0,1), UDim2.new(0,10,0,78), COLORS.border)

-- Email
makeLabel(loginScreen, "E-Mail", 12, COLORS.secondary, UDim2.new(0,10,0,92))
local _, emailBox = makeInput(loginScreen, "deine@email.com", UDim2.new(0,10,0,112))

-- Passwort
makeLabel(loginScreen, "Passwort", 12, COLORS.secondary, UDim2.new(0,10,0,158))
local _, pwBox = makeInput(loginScreen, "Passwort", UDim2.new(0,10,0,178), 36, true)

-- Fehler-Label
local loginError = makeLabel(loginScreen, "", 11, COLORS.red, UDim2.new(0,10,0,224))
loginError.Size = UDim2.new(1,-20,0,28)
loginError.TextWrapped = true

-- Login Button
local loginBtn = makeButton(loginScreen, "Anmelden", UDim2.new(0,10,0,258), nil, true)

-- Registrieren Hinweis
local regLabel = makeLabel(loginScreen, "Kein Account? xeron-labs.com/register", 11, COLORS.muted, UDim2.new(0,10,0,304))
regLabel.Size = UDim2.new(1,-20,0,16)

loginBtn.MouseButton1Click:Connect(function()
    local email    = emailBox.Text
    local password = pwBox.Text

    if email == "" or password == "" then
        loginError.Text = "Bitte E-Mail und Passwort eingeben."
        return
    end

    loginBtn.Text = "Anmelden..."
    loginError.Text = ""

    local data, err = apiRequest("POST", "/api/plugin/auth", {
        email    = email,
        password = password,
    })

    if err or not data then
        loginError.Text = err or "Anmeldung fehlgeschlagen."
        loginBtn.Text = "Anmelden"
        return
    end

    if data.session_token then
        saveToken(data.session_token)
        loginBtn.Text = "Anmelden"
        showScreen("projects")
        -- Projekte laden
        task.spawn(function() loadProjects() end)
    else
        loginError.Text = data.error or "Ungültige Antwort vom Server."
        loginBtn.Text = "Anmelden"
    end
end)

-- ============================================================
-- SCREEN 2: PROJEKTE
-- ============================================================
local projectsScreen = makeFrame(mainFrame, UDim2.new(1,0,1,0), UDim2.new(0,0,0,0), COLORS.bg)
projectsScreen.Visible = false
screens["projects"] = projectsScreen

-- Header
local projHeader = makeFrame(projectsScreen, UDim2.new(1,0,0,56), UDim2.new(0,0,0,0), COLORS.surface)
local projTitle = makeLabel(projHeader, "Projekte", 16, COLORS.white, UDim2.new(0,12,0,10))
projTitle.Font = Enum.Font.GothamBlack

local creditsBadge = makeLabel(projHeader, "■ Credits: --", 11, COLORS.cyan, UDim2.new(0,12,0,34))
creditsBadge.Size = UDim2.new(0.7,0,0,16)

local logoutBtn = makeButton(projHeader, "Logout", UDim2.new(1,-72,0,10), UDim2.new(0,62,0,36), false)
logoutBtn.TextSize = 11

-- Scroll-Container für Projekte
local scrollFrame = Instance.new("ScrollingFrame")
scrollFrame.Size              = UDim2.new(1,0,1,-136)
scrollFrame.Position          = UDim2.new(0,0,0,56)
scrollFrame.BackgroundTransparency = 1
scrollFrame.BorderSizePixel   = 0
scrollFrame.ScrollBarThickness = 4
scrollFrame.ScrollBarImageColor3 = COLORS.red
scrollFrame.CanvasSize        = UDim2.new(0,0,0,0)
scrollFrame.AutomaticCanvasSize = Enum.AutomaticSize.Y
scrollFrame.Parent            = projectsScreen

local listLayout = Instance.new("UIListLayout")
listLayout.Padding         = UDim.new(0, 6)
listLayout.SortOrder       = Enum.SortOrder.LayoutOrder
listLayout.Parent          = scrollFrame

local listPad = Instance.new("UIPadding")
listPad.PaddingLeft   = UDim.new(0, 10)
listPad.PaddingRight  = UDim.new(0, 10)
listPad.PaddingTop    = UDim.new(0, 8)
listPad.Parent        = scrollFrame

-- "Neues Spiel" Button unten
local newGameBtn = makeButton(
    projectsScreen,
    "+ Neues Spiel auf xeron-labs.com",
    UDim2.new(0,10,1,-48),
    UDim2.new(1,-20,0,36),
    true
)

newGameBtn.MouseButton1Click:Connect(function()
    -- Öffnet Browser (im Studio nicht direkt möglich)
    warn("[XERON] Öffne: https://xeron-labs.com/dashboard")
end)

logoutBtn.MouseButton1Click:Connect(function()
    clearToken()
    showScreen("login")
end)

local loadingLabel = makeLabel(projectsScreen, "Projekte werden geladen...", 12, COLORS.muted, UDim2.new(0,10,0,70))

local function clearProjectList()
    for _, child in ipairs(scrollFrame:GetChildren()) do
        if child:IsA("Frame") then
            child:Destroy()
        end
    end
end

function loadProjects()
    clearProjectList()
    loadingLabel.Visible = true

    local data, err = apiRequest("GET", "/api/plugin/projects", nil)

    loadingLabel.Visible = false

    if err or not data then
        loadingLabel.Text = "Fehler beim Laden: " .. (err or "Unbekannt")
        loadingLabel.Visible = true
        return
    end

    -- Credits anzeigen
    if data.credits then
        creditsBadge.Text = "■ Credits: " .. tostring(data.credits)
    end

    local projects = data.projects or {}

    if #projects == 0 then
        loadingLabel.Text = "Noch keine Projekte. Erstelle dein erstes Spiel!"
        loadingLabel.Visible = true
        return
    end

    for i, proj in ipairs(projects) do
        local card = makeFrame(scrollFrame, UDim2.new(1,0,0,80), nil, COLORS.surface, 10)
        card.LayoutOrder = i

        local stroke = Instance.new("UIStroke")
        stroke.Color = COLORS.border
        stroke.Thickness = 1
        stroke.Parent = card

        local nameLabel = makeLabel(card, proj.name or "Unbekannt", 13, COLORS.white, UDim2.new(0,10,0,10))
        nameLabel.Size = UDim2.new(1,-80,0,18)

        local statusColor = proj.status == "done" and COLORS.green or
                            proj.status == "error" and COLORS.red or COLORS.cyan
        local statusLabel = makeLabel(card, proj.status or "?", 10, statusColor, UDim2.new(1,-70,0,12))
        statusLabel.Size = UDim2.new(0,60,0,16)
        statusLabel.TextXAlignment = Enum.TextXAlignment.Right

        local gameTypeLabel = makeLabel(card, (proj.game_type or "custom") .. " · " .. (proj.quality or "standard"), 11, COLORS.muted, UDim2.new(0,10,0,32))

        if proj.status == "done" then
            local loadBtn = makeButton(card, "In Studio laden", UDim2.new(0,10,1,-40), UDim2.new(1,-20,0,28), true)
            loadBtn.TextSize = 12

            local projId = proj.id
            loadBtn.MouseButton1Click:Connect(function()
                loadBtn.Text = "Wird geladen..."
                task.spawn(function()
                    loadProjectToStudio(projId, loadBtn)
                end)
            end)
        end
    end
end

-- ============================================================
-- SCREEN 3: FORTSCHRITT (Lua-Ausführung)
-- ============================================================
local progressScreen = makeFrame(mainFrame, UDim2.new(1,0,1,0), UDim2.new(0,0,0,0), COLORS.bg)
progressScreen.Visible = false
screens["progress"] = progressScreen

local progHeader = makeFrame(progressScreen, UDim2.new(1,0,0,56), UDim2.new(0,0,0,0), COLORS.surface)
local progTitle = makeLabel(progHeader, "Spiel wird geladen...", 14, COLORS.white, UDim2.new(0,12,0,18))
progTitle.Font = Enum.Font.GothamBlack

local progStatus = makeLabel(progressScreen, "", 12, COLORS.cyan, UDim2.new(0,10,0,68))
progStatus.Size = UDim2.new(1,-20,0,20)

local progLog = Instance.new("ScrollingFrame")
progLog.Size              = UDim2.new(1,-20,1,-160)
progLog.Position          = UDim2.new(0,10,0,96)
progLog.BackgroundColor3  = COLORS.surface
progLog.BorderSizePixel   = 0
progLog.ScrollBarThickness = 3
progLog.ScrollBarImageColor3 = COLORS.cyan
progLog.AutomaticCanvasSize = Enum.AutomaticSize.Y
progLog.CanvasSize        = UDim2.new(0,0,0,0)
progLog.Parent            = progressScreen

local logLayout = Instance.new("UIListLayout")
logLayout.Padding = UDim.new(0,2)
logLayout.Parent = progLog
local logPad = Instance.new("UIPadding")
logPad.PaddingLeft = UDim.new(0,6)
logPad.PaddingTop  = UDim.new(0,4)
logPad.Parent = progLog

local corner3 = Instance.new("UICorner")
corner3.CornerRadius = UDim.new(0,8)
corner3.Parent = progLog

local abortBtn = makeButton(progressScreen, "Abbrechen", UDim2.new(0,10,1,-48), nil, false)
local backBtn  = makeButton(progressScreen, "Zurück zu Projekten", UDim2.new(0,10,1,-48), nil, false)
backBtn.Visible = false

abortBtn.MouseButton1Click:Connect(function()
    showScreen("projects")
end)
backBtn.MouseButton1Click:Connect(function()
    backBtn.Visible = false
    abortBtn.Visible = true
    showScreen("projects")
end)

local function addLogLine(text, color)
    local l = Instance.new("TextLabel")
    l.Text = "> " .. text
    l.TextColor3 = color or COLORS.secondary
    l.BackgroundTransparency = 1
    l.Font = Enum.Font.Code
    l.TextSize = 11
    l.TextXAlignment = Enum.TextXAlignment.Left
    l.Size = UDim2.new(1,-4,0,16)
    l.TextWrapped = true
    l.AutomaticSize = Enum.AutomaticSize.Y
    l.Parent = progLog
end

function loadProjectToStudio(projectId, loadBtn)
    showScreen("progress")
    progTitle.Text = "Projekt wird geladen..."
    progStatus.Text = "Daten werden abgerufen..."
    abortBtn.Visible = true
    backBtn.Visible = false

    -- Log leeren
    for _, c in ipairs(progLog:GetChildren()) do
        if c:IsA("TextLabel") then c:Destroy() end
    end

    addLogLine("Verbindung zu XERON Engine...", COLORS.cyan)

    local data, err = apiRequest("GET", "/api/plugin/sync?projectId=" .. projectId, nil)

    if err or not data then
        addLogLine("Fehler: " .. (err or "Unbekannt"), COLORS.red)
        progStatus.Text = "Fehler beim Laden"
        abortBtn.Visible = false
        backBtn.Visible = true
        if loadBtn then loadBtn.Text = "In Studio laden" end
        return
    end

    local tasks = data.tasks or {}
    progTitle.Text = data.projectName or "Projekt"
    addLogLine("Projekt: " .. (data.projectName or "?"), COLORS.white)
    addLogLine(#tasks .. " Tasks werden ausgeführt...", COLORS.cyan)

    local errors = 0
    for i, t in ipairs(tasks) do
        progStatus.Text = string.format("Task %d/%d: %s", i, #tasks, t.name or "?")
        addLogLine(string.format("[%d/%d] %s", i, #tasks, t.name or "?"))

        if t.lua and t.lua ~= "" then
            local ok, execErr = pcall(function()
                local fn, loadErr = loadstring(t.lua)
                if fn then
                    fn()
                else
                    error("Syntaxfehler: " .. tostring(loadErr))
                end
            end)

            if ok then
                addLogLine("  ✓ Erfolgreich", COLORS.green)
            else
                errors = errors + 1
                addLogLine("  ✗ Fehler: " .. tostring(execErr), COLORS.red)
            end
        else
            addLogLine("  Kein Lua-Code", COLORS.muted)
        end

        task.wait(0.1)
    end

    progStatus.Text = errors == 0
        and "Fertig! " .. #tasks .. " Tasks ausgeführt."
        or  string.format("Fertig mit %d Fehler(n).", errors)

    addLogLine(
        errors == 0 and "Alle Tasks erfolgreich!" or "Abgeschlossen mit Fehlern.",
        errors == 0 and COLORS.green or COLORS.red
    )

    abortBtn.Visible = false
    backBtn.Visible = true
    if loadBtn then loadBtn.Text = "In Studio laden" end
end

-- ============================================================
-- PLUGIN API ROUTES (server-seitig)
-- ============================================================
-- /api/plugin/auth  — POST  { email, password } -> { session_token }
-- /api/plugin/projects — GET (X-Session-Token) -> { projects, credits }
-- /api/plugin/sync  — GET  ?projectId=... -> { projectName, tasks }

-- ============================================================
-- TOGGLE
-- ============================================================
toggleButton.Click:Connect(function()
    widget.Enabled = not widget.Enabled
end)

-- Beim Start: Token prüfen
task.spawn(function()
    local token = getToken()
    if token and token ~= "" then
        showScreen("projects")
        loadProjects()
    else
        showScreen("login")
    end
end)
