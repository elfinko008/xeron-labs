-- ═══════════════════════════════════════════════════════════════
--  XERON Engine v7 — Roblox Studio Plugin
--  Website: https://xeron-labs.com
-- ═══════════════════════════════════════════════════════════════

local BASE_URL = "https://xeron-labs.com"
local PLUGIN_VERSION = "7.0.0"
local SETTING_TOKEN = "xeron_session_token_v7"

local HttpService = game:GetService("HttpService")
local StudioService = game:GetService("StudioService")
local Selection = game:GetService("Selection")
local Workspace = game:GetService("Workspace")

-- ── TOOLBAR & BUTTON ──────────────────────────────────────────
local toolbar = plugin:CreateToolbar("XERON Engine v7")
local toggleButton = toolbar:CreateButton(
	"XERON Engine",
	"Open XERON Engine — AI Roblox Game Builder",
	"rbxassetid://0"
)

-- ── DOCK WIDGET ───────────────────────────────────────────────
local widgetInfo = DockWidgetPluginGuiInfo.new(
	Enum.InitialDockState.Right,
	false,  -- initially disabled
	false,  -- not overriding previous enabled state
	320, 560,  -- initial size
	280, 480   -- min size
)

local widget = plugin:CreateDockWidgetPluginGui("XeronEngineV7", widgetInfo)
widget.Title = "XERON Engine"

-- ── STATE ─────────────────────────────────────────────────────
local sessionToken = plugin:GetSetting(SETTING_TOKEN) or ""
local currentScreen = sessionToken ~= "" and "home" or "login"
local selectedMode = "script"

-- ── COLORS ────────────────────────────────────────────────────
local GOLD     = Color3.fromRGB(212, 160, 23)
local GOLD_DIM = Color3.fromRGB(139, 95, 0)
local BG_DEEP  = Color3.fromRGB(7, 7, 26)
local BG_CARD  = Color3.fromRGB(18, 18, 46)
local BG_INPUT = Color3.fromRGB(12, 12, 36)
local TEXT_1   = Color3.fromRGB(240, 241, 252)
local TEXT_2   = Color3.fromRGB(176, 180, 216)
local TEXT_3   = Color3.fromRGB(110, 114, 153)
local SUCCESS  = Color3.fromRGB(74, 222, 128)
local ERROR_C  = Color3.fromRGB(248, 113, 113)
local WHITE    = Color3.new(1, 1, 1)

-- ── API HELPER ────────────────────────────────────────────────
local function apiRequest(method, path, body)
	local ok, result = pcall(function()
		local options = {
			Url = BASE_URL .. path,
			Method = method,
			Headers = {
				["Content-Type"] = "application/json",
				["X-Session-Token"] = sessionToken,
				["X-Plugin-Version"] = PLUGIN_VERSION,
			}
		}
		if body then
			options.Body = HttpService:JSONEncode(body)
		end
		local response = HttpService:RequestAsync(options)
		if response.Success then
			return HttpService:JSONDecode(response.Body)
		else
			return { error = "HTTP " .. response.StatusCode }
		end
	end)
	if ok then return result
	else return { error = tostring(result) } end
end

-- ── UI BUILDER ────────────────────────────────────────────────
local function clearWidget()
	for _, child in ipairs(widget:GetChildren()) do
		if child:IsA("GuiObject") then child:Destroy() end
	end
end

local function makeLabel(parent, text, size, weight, color, pos, labelSize)
	local lbl = Instance.new("TextLabel")
	lbl.Parent = parent
	lbl.Text = text
	lbl.TextSize = size or 14
	lbl.Font = weight == "bold" and Enum.Font.GothamBold or Enum.Font.Gotham
	lbl.TextColor3 = color or TEXT_1
	lbl.BackgroundTransparency = 1
	lbl.Position = pos or UDim2.new(0, 0, 0, 0)
	lbl.Size = labelSize or UDim2.new(1, 0, 0, 20)
	lbl.TextXAlignment = Enum.TextXAlignment.Left
	lbl.TextWrapped = true
	return lbl
end

local function makeInput(parent, placeholder, pos, size, isPassword)
	local frame = Instance.new("Frame")
	frame.Parent = parent
	frame.Position = pos
	frame.Size = size or UDim2.new(1, -32, 0, 40)
	frame.BackgroundColor3 = BG_INPUT
	frame.BorderSizePixel = 0
	Instance.new("UICorner", frame).CornerRadius = UDim.new(0, 10)
	Instance.new("UIStroke", frame).Color = Color3.fromRGB(58, 61, 92)

	local box = Instance.new("TextBox")
	box.Parent = frame
	box.Size = UDim2.new(1, -20, 1, 0)
	box.Position = UDim2.new(0, 10, 0, 0)
	box.BackgroundTransparency = 1
	box.TextColor3 = TEXT_1
	box.PlaceholderColor3 = TEXT_3
	box.PlaceholderText = placeholder
	box.Font = Enum.Font.Gotham
	box.TextSize = 13
	box.Text = ""
	box.TextXAlignment = Enum.TextXAlignment.Left
	if isPassword then box.TextTransparency = 0 end
	return box, frame
end

local function makeButton(parent, text, pos, size, isPrimary)
	local btn = Instance.new("TextButton")
	btn.Parent = parent
	btn.Position = pos
	btn.Size = size or UDim2.new(1, -32, 0, 40)
	btn.BackgroundColor3 = isPrimary and GOLD or BG_CARD
	btn.BorderSizePixel = 0
	btn.Text = text
	btn.TextColor3 = isPrimary and Color3.fromRGB(10, 9, 0) or TEXT_1
	btn.Font = Enum.Font.GothamBold
	btn.TextSize = 13
	Instance.new("UICorner", btn).CornerRadius = UDim.new(0, 10)
	if not isPrimary then
		local stroke = Instance.new("UIStroke", btn)
		stroke.Color = Color3.fromRGB(58, 61, 92)
	end
	return btn
end

-- ── SCREEN: LOGIN ─────────────────────────────────────────────
local function showLoginScreen()
	clearWidget()
	currentScreen = "login"

	local scroll = Instance.new("ScrollingFrame")
	scroll.Parent = widget
	scroll.Size = UDim2.new(1, 0, 1, 0)
	scroll.BackgroundColor3 = BG_DEEP
	scroll.BorderSizePixel = 0
	scroll.ScrollBarThickness = 3
	scroll.CanvasSize = UDim2.new(0, 0, 0, 480)
	scroll.AutomaticCanvasSize = Enum.AutomaticSize.Y

	local padding = Instance.new("UIPadding", scroll)
	padding.PaddingLeft = UDim.new(0, 16)
	padding.PaddingRight = UDim.new(0, 16)
	padding.PaddingTop = UDim.new(0, 24)

	local layout = Instance.new("UIListLayout", scroll)
	layout.Padding = UDim.new(0, 12)
	layout.SortOrder = Enum.SortOrder.LayoutOrder

	-- Logo
	local logo = makeLabel(scroll, "✦ XERON", 22, "bold", GOLD, nil, UDim2.new(1, 0, 0, 30))
	logo.LayoutOrder = 1
	logo.TextXAlignment = Enum.TextXAlignment.Center

	local tagline = makeLabel(scroll, "AI Roblox Game Engine", 11, nil, TEXT_3, nil, UDim2.new(1, 0, 0, 16))
	tagline.LayoutOrder = 2
	tagline.TextXAlignment = Enum.TextXAlignment.Center

	local spacer = Instance.new("Frame", scroll)
	spacer.LayoutOrder = 3
	spacer.Size = UDim2.new(1, 0, 0, 8)
	spacer.BackgroundTransparency = 1

	local emailLabel = makeLabel(scroll, "Email", 11, nil, TEXT_3, nil, UDim2.new(1, 0, 0, 14))
	emailLabel.LayoutOrder = 4

	local emailBox, emailFrame = makeInput(scroll, "your@email.com", UDim2.new(0, 0, 0, 0), UDim2.new(1, 0, 0, 40))
	emailFrame.LayoutOrder = 5

	local pwLabel = makeLabel(scroll, "Password", 11, nil, TEXT_3, nil, UDim2.new(1, 0, 0, 14))
	pwLabel.LayoutOrder = 6

	local pwBox, pwFrame = makeInput(scroll, "••••••••", UDim2.new(0, 0, 0, 0), UDim2.new(1, 0, 0, 40), true)
	pwFrame.LayoutOrder = 7

	local statusLabel = makeLabel(scroll, "", 11, nil, ERROR_C, nil, UDim2.new(1, 0, 0, 14))
	statusLabel.LayoutOrder = 8
	statusLabel.TextXAlignment = Enum.TextXAlignment.Center

	local loginBtn = makeButton(scroll, "Sign In", UDim2.new(0, 0, 0, 0), UDim2.new(1, 0, 0, 44), true)
	loginBtn.LayoutOrder = 9

	local signupLabel = makeLabel(scroll, "Don't have an account? → xeron-labs.com/register", 11, nil, TEXT_3, nil, UDim2.new(1, 0, 0, 16))
	signupLabel.LayoutOrder = 10
	signupLabel.TextXAlignment = Enum.TextXAlignment.Center

	loginBtn.MouseButton1Click:Connect(function()
		local email = emailBox.Text:match("^%s*(.-)%s*$")
		local password = pwBox.Text
		if email == "" or password == "" then
			statusLabel.Text = "Please enter email and password"
			return
		end
		loginBtn.Text = "Signing in..."
		loginBtn.BackgroundColor3 = GOLD_DIM
		statusLabel.Text = ""

		local result = apiRequest("POST", "/api/plugin/auth", { email = email, password = password })
		if result and result.token then
			sessionToken = result.token
			plugin:SetSetting(SETTING_TOKEN, sessionToken)
			showHomeScreen()
		else
			loginBtn.Text = "Sign In"
			loginBtn.BackgroundColor3 = GOLD
			statusLabel.Text = result and result.error or "Login failed. Check credentials."
		end
	end)
end

-- ── SCREEN: HOME ──────────────────────────────────────────────
local function showHomeScreen()
	clearWidget()
	currentScreen = "home"

	local scroll = Instance.new("ScrollingFrame")
	scroll.Parent = widget
	scroll.Size = UDim2.new(1, 0, 1, 0)
	scroll.BackgroundColor3 = BG_DEEP
	scroll.BorderSizePixel = 0
	scroll.ScrollBarThickness = 3
	scroll.AutomaticCanvasSize = Enum.AutomaticSize.Y

	local padding = Instance.new("UIPadding", scroll)
	padding.PaddingLeft = UDim.new(0, 16)
	padding.PaddingRight = UDim.new(0, 16)
	padding.PaddingTop = UDim.new(0, 16)

	local layout = Instance.new("UIListLayout", scroll)
	layout.Padding = UDim.new(0, 10)
	layout.SortOrder = Enum.SortOrder.LayoutOrder

	-- Header
	local header = Instance.new("Frame", scroll)
	header.LayoutOrder = 1
	header.Size = UDim2.new(1, 0, 0, 36)
	header.BackgroundTransparency = 1

	local logoText = makeLabel(header, "✦ XERON", 16, "bold", GOLD, UDim2.new(0, 0, 0, 4), UDim2.new(0.6, 0, 1, 0))

	local logoutBtn = makeButton(header, "Logout", UDim2.new(0.65, 0, 0.1, 0), UDim2.new(0.35, 0, 0.8, 0), false)
	logoutBtn.TextSize = 11

	logoutBtn.MouseButton1Click:Connect(function()
		sessionToken = ""
		plugin:SetSetting(SETTING_TOKEN, "")
		showLoginScreen()
	end)

	-- Mode selector label
	local modeLabel = makeLabel(scroll, "Select Mode", 11, nil, TEXT_3, nil, UDim2.new(1, 0, 0, 14))
	modeLabel.LayoutOrder = 2

	-- Mode buttons grid
	local modes = {
		{ id = "game",    label = "✦ Game",   cost = "50cr" },
		{ id = "script",  label = "⌨ Script",  cost = "10cr" },
		{ id = "ui",      label = "⊞ UI",      cost = "10cr" },
		{ id = "fix",     label = "⚙ Fix",     cost = "15cr" },
		{ id = "clean",   label = "⊘ Clean",   cost = "10cr" },
		{ id = "diagnose",label = "◈ Diagnose",cost = "5cr"  },
	}

	local modeButtons = {}
	local modeFrame = Instance.new("Frame", scroll)
	modeFrame.LayoutOrder = 3
	modeFrame.Size = UDim2.new(1, 0, 0, 96)
	modeFrame.BackgroundTransparency = 1

	local modeGrid = Instance.new("UIGridLayout", modeFrame)
	modeGrid.CellSize = UDim2.new(0.5, -5, 0, 44)
	modeGrid.CellPadding = UDim2.new(0, 6, 0, 6)

	for _, mode in ipairs(modes) do
		local btn = Instance.new("TextButton", modeFrame)
		btn.BackgroundColor3 = selectedMode == mode.id and BG_CARD or BG_INPUT
		btn.BorderSizePixel = 0
		btn.Text = mode.label .. "\n" .. mode.cost
		btn.TextColor3 = selectedMode == mode.id and GOLD or TEXT_2
		btn.Font = Enum.Font.Gotham
		btn.TextSize = 11
		Instance.new("UICorner", btn).CornerRadius = UDim.new(0, 8)
		if selectedMode == mode.id then
			local stroke = Instance.new("UIStroke", btn)
			stroke.Color = GOLD
		end
		modeButtons[mode.id] = btn

		local modeId = mode.id
		btn.MouseButton1Click:Connect(function()
			selectedMode = modeId
			showHomeScreen()
		end)
	end

	-- Prompt label
	local promptLabel = makeLabel(scroll, "Describe your " .. selectedMode, 11, nil, TEXT_3, nil, UDim2.new(1, 0, 0, 14))
	promptLabel.LayoutOrder = 4

	-- Prompt input
	local promptFrame = Instance.new("Frame", scroll)
	promptFrame.LayoutOrder = 5
	promptFrame.Size = UDim2.new(1, 0, 0, 100)
	promptFrame.BackgroundColor3 = BG_INPUT
	promptFrame.BorderSizePixel = 0
	Instance.new("UICorner", promptFrame).CornerRadius = UDim.new(0, 10)
	Instance.new("UIStroke", promptFrame).Color = Color3.fromRGB(58, 61, 92)

	local promptBox = Instance.new("TextBox", promptFrame)
	promptBox.Size = UDim2.new(1, -16, 1, -16)
	promptBox.Position = UDim2.new(0, 8, 0, 8)
	promptBox.BackgroundTransparency = 1
	promptBox.TextColor3 = TEXT_1
	promptBox.PlaceholderColor3 = TEXT_3
	promptBox.PlaceholderText = "Describe your Roblox " .. selectedMode .. "..."
	promptBox.Font = Enum.Font.Gotham
	promptBox.TextSize = 12
	promptBox.Text = ""
	promptBox.TextXAlignment = Enum.TextXAlignment.Left
	promptBox.TextYAlignment = Enum.TextYAlignment.Top
	promptBox.MultiLine = true
	promptBox.TextWrapped = true

	-- Status
	local statusLbl = makeLabel(scroll, "", 11, nil, TEXT_3, nil, UDim2.new(1, 0, 0, 14))
	statusLbl.LayoutOrder = 6
	statusLbl.TextXAlignment = Enum.TextXAlignment.Center

	-- Generate button
	local genBtn = makeButton(scroll, "✦ Generate", UDim2.new(0, 0, 0, 0), UDim2.new(1, 0, 0, 44), true)
	genBtn.LayoutOrder = 7

	-- Recent projects
	local projLabel = makeLabel(scroll, "Recent Projects", 11, nil, TEXT_3, nil, UDim2.new(1, 0, 0, 14))
	projLabel.LayoutOrder = 8

	-- Load projects
	local projectsResult = apiRequest("GET", "/api/plugin/projects", nil)
	if projectsResult and projectsResult.projects then
		for i, proj in ipairs(projectsResult.projects) do
			if i > 5 then break end
			local pFrame = Instance.new("Frame", scroll)
			pFrame.LayoutOrder = 8 + i
			pFrame.Size = UDim2.new(1, 0, 0, 52)
			pFrame.BackgroundColor3 = BG_CARD
			pFrame.BorderSizePixel = 0
			Instance.new("UICorner", pFrame).CornerRadius = UDim.new(0, 8)

			local pName = makeLabel(pFrame, proj.name or "Untitled", 12, "bold", TEXT_1, UDim2.new(0, 10, 0, 6), UDim2.new(0.7, 0, 0, 18))
			local pMode = makeLabel(pFrame, proj.mode or "script", 10, nil, TEXT_3, UDim2.new(0, 10, 0, 26), UDim2.new(0.5, 0, 0, 14))

			local statusColor = proj.status == "done" and SUCCESS or (proj.status == "error" and ERROR_C or GOLD)
			local pStatus = makeLabel(pFrame, proj.status or "done", 10, nil, statusColor, UDim2.new(0.6, 0, 0.2, 0), UDim2.new(0.38, -4, 0.6, 0))
			pStatus.TextXAlignment = Enum.TextXAlignment.Right

			local importBtn = makeButton(pFrame, "Import", UDim2.new(0.72, 0, 0.15, 0), UDim2.new(0.26, 0, 0.7, 0), true)
			importBtn.TextSize = 10

			local projId = proj.id
			importBtn.MouseButton1Click:Connect(function()
				importBtn.Text = "..."
				local syncResult = apiRequest("GET", "/api/plugin/sync?id=" .. projId, nil)
				if syncResult and syncResult.lua_output then
					showResultScreen(syncResult.lua_output, proj.name or "Project", proj.mode or "script")
				else
					importBtn.Text = "Error"
					wait(2)
					importBtn.Text = "Import"
				end
			end)
		end
	end

	genBtn.MouseButton1Click:Connect(function()
		local prompt = promptBox.Text:match("^%s*(.-)%s*$")
		if prompt == "" then
			statusLbl.Text = "Please enter a description"
			statusLbl.TextColor3 = ERROR_C
			return
		end
		showProgressScreen(prompt, selectedMode)
	end)
end

-- ── SCREEN: PROGRESS ──────────────────────────────────────────
function showProgressScreen(prompt, mode)
	clearWidget()
	currentScreen = "progress"

	local frame = Instance.new("Frame", widget)
	frame.Size = UDim2.new(1, 0, 1, 0)
	frame.BackgroundColor3 = BG_DEEP
	frame.BorderSizePixel = 0

	local padding = Instance.new("UIPadding", frame)
	padding.PaddingAll = UDim.new(0, 16)

	local layout = Instance.new("UIListLayout", frame)
	layout.Padding = UDim.new(0, 12)

	local header = makeLabel(frame, "✦ XERON is Building...", 15, "bold", GOLD, nil, UDim2.new(1, 0, 0, 22))
	header.LayoutOrder = 1
	header.TextXAlignment = Enum.TextXAlignment.Center

	local modeLabel = makeLabel(frame, "Mode: " .. mode:upper(), 11, nil, TEXT_3, nil, UDim2.new(1, 0, 0, 14))
	modeLabel.LayoutOrder = 2
	modeLabel.TextXAlignment = Enum.TextXAlignment.Center

	local progressBg = Instance.new("Frame", frame)
	progressBg.LayoutOrder = 3
	progressBg.Size = UDim2.new(1, 0, 0, 4)
	progressBg.BackgroundColor3 = Color3.fromRGB(26, 26, 62)
	progressBg.BorderSizePixel = 0
	Instance.new("UICorner", progressBg).CornerRadius = UDim.new(1, 0)

	local progressFill = Instance.new("Frame", progressBg)
	progressFill.Size = UDim2.new(0, 0, 1, 0)
	progressFill.BackgroundColor3 = GOLD
	progressFill.BorderSizePixel = 0
	Instance.new("UICorner", progressFill).CornerRadius = UDim.new(1, 0)

	local logFrame = Instance.new("ScrollingFrame", frame)
	logFrame.LayoutOrder = 4
	logFrame.Size = UDim2.new(1, 0, 0, 320)
	logFrame.BackgroundColor3 = BG_INPUT
	logFrame.BorderSizePixel = 0
	logFrame.ScrollBarThickness = 3
	logFrame.AutomaticCanvasSize = Enum.AutomaticSize.Y
	Instance.new("UICorner", logFrame).CornerRadius = UDim.new(0, 10)
	local logPad = Instance.new("UIPadding", logFrame)
	logPad.PaddingAll = UDim.new(0, 10)
	local logLayout = Instance.new("UIListLayout", logFrame)
	logLayout.Padding = UDim.new(0, 4)

	local function addLog(text, isSuccess)
		local lbl = makeLabel(logFrame, (isSuccess and "✓ " or ">> ") .. text, 11, nil, isSuccess and SUCCESS or TEXT_2, nil, UDim2.new(1, 0, 0, 16))
		lbl.LayoutOrder = #logFrame:GetChildren()
		logFrame.CanvasPosition = Vector2.new(0, logFrame.AbsoluteCanvasSize.Y)
	end

	-- Submit to API
	local result = apiRequest("POST", "/api/generate", {
		prompt = prompt,
		mode = mode,
		quality = "standard"
	})

	if result and result.project_id then
		local projectId = result.project_id
		addLog("Project created. Generating...", false)

		-- Poll for completion
		local attempts = 0
		local maxAttempts = 90  -- 3 minutes at 2s intervals

		while attempts < maxAttempts do
			wait(2)
			attempts = attempts + 1
			progressFill.Size = UDim2.new(math.min(0.9, attempts / maxAttempts), 0, 1, 0)

			local status = apiRequest("GET", "/api/generate/status?id=" .. projectId, nil)
			if status and status.status == "done" then
				progressFill.Size = UDim2.new(1, 0, 1, 0)
				addLog("Generation complete!", true)
				wait(0.5)
				showResultScreen(status.lua_output, status.name or "Project", mode)
				return
			elseif status and status.status == "error" then
				addLog("Generation failed: " .. (status.error or "Unknown error"), false)
				wait(2)
				showHomeScreen()
				return
			elseif status and status.tasks then
				for _, task in ipairs(status.tasks) do
					if task.completed then addLog(task.label, true) end
				end
			end
		end
		addLog("Timeout — please check My Projects in dashboard", false)
		wait(3)
		showHomeScreen()
	else
		addLog("Error: " .. (result and result.error or "Failed to start generation"), false)
		wait(3)
		showHomeScreen()
	end
end

-- ── SCREEN: RESULT ────────────────────────────────────────────
function showResultScreen(luaCode, projectName, mode)
	clearWidget()
	currentScreen = "result"

	local frame = Instance.new("Frame", widget)
	frame.Size = UDim2.new(1, 0, 1, 0)
	frame.BackgroundColor3 = BG_DEEP
	frame.BorderSizePixel = 0

	local padding = Instance.new("UIPadding", frame)
	padding.PaddingAll = UDim.new(0, 16)

	local layout = Instance.new("UIListLayout", frame)
	layout.Padding = UDim.new(0, 10)

	local header = makeLabel(frame, "✓ " .. projectName, 14, "bold", SUCCESS, nil, UDim2.new(1, 0, 0, 20))
	header.LayoutOrder = 1
	header.TextXAlignment = Enum.TextXAlignment.Center

	local modeLabel = makeLabel(frame, mode:upper() .. " — Ready to Import", 11, nil, TEXT_3, nil, UDim2.new(1, 0, 0, 14))
	modeLabel.LayoutOrder = 2
	modeLabel.TextXAlignment = Enum.TextXAlignment.Center

	local importBtn = makeButton(frame, "✦ Import to Workspace", UDim2.new(0, 0, 0, 0), UDim2.new(1, 0, 0, 44), true)
	importBtn.LayoutOrder = 3

	local copyBtn = makeButton(frame, "Copy to Clipboard", UDim2.new(0, 0, 0, 0), UDim2.new(1, 0, 0, 36), false)
	copyBtn.LayoutOrder = 4

	local backBtn = makeButton(frame, "← Back to Home", UDim2.new(0, 0, 0, 0), UDim2.new(1, 0, 0, 36), false)
	backBtn.LayoutOrder = 5

	local preview = Instance.new("ScrollingFrame", frame)
	preview.LayoutOrder = 6
	preview.Size = UDim2.new(1, 0, 0, 200)
	preview.BackgroundColor3 = BG_INPUT
	preview.BorderSizePixel = 0
	preview.ScrollBarThickness = 3
	Instance.new("UICorner", preview).CornerRadius = UDim.new(0, 8)
	local previewPad = Instance.new("UIPadding", preview)
	previewPad.PaddingAll = UDim.new(0, 10)

	local codeLabel = Instance.new("TextLabel", preview)
	codeLabel.Size = UDim2.new(1, 0, 0, 0)
	codeLabel.AutomaticSize = Enum.AutomaticSize.Y
	codeLabel.BackgroundTransparency = 1
	codeLabel.TextColor3 = TEXT_2
	codeLabel.Font = Enum.Font.Code
	codeLabel.TextSize = 10
	codeLabel.Text = luaCode and string.sub(luaCode, 1, 1000) .. (string.len(luaCode) > 1000 and "\n..." or "") or ""
	codeLabel.TextXAlignment = Enum.TextXAlignment.Left
	codeLabel.TextWrapped = true

	-- Import: create a ModuleScript or LocalScript in workspace
	importBtn.MouseButton1Click:Connect(function()
		importBtn.Text = "Importing..."
		local ok, err = pcall(function()
			local scriptObj
			if mode == "game" or mode == "script" or mode == "fix" or mode == "clean" then
				scriptObj = Instance.new("Script")
			elseif mode == "ui" then
				scriptObj = Instance.new("LocalScript")
			else
				scriptObj = Instance.new("ModuleScript")
			end
			scriptObj.Name = projectName
			scriptObj.Source = luaCode or "-- XERON: No output generated"
			scriptObj.Parent = Workspace
			Selection:Set({scriptObj})
		end)
		if ok then
			importBtn.Text = "✓ Imported!"
			importBtn.BackgroundColor3 = SUCCESS
			importBtn.TextColor3 = Color3.fromRGB(0, 0, 0)
		else
			importBtn.Text = "Error: " .. tostring(err)
			wait(3)
			importBtn.Text = "✦ Import to Workspace"
			importBtn.BackgroundColor3 = GOLD
			importBtn.TextColor3 = Color3.fromRGB(10, 9, 0)
		end
	end)

	copyBtn.MouseButton1Click:Connect(function()
		-- Clipboard not available in Roblox Studio plugin context
		-- Show instruction instead
		copyBtn.Text = "Paste in Script Editor"
		wait(2)
		copyBtn.Text = "Copy to Clipboard"
	end)

	backBtn.MouseButton1Click:Connect(function()
		showHomeScreen()
	end)
end

-- ── TOGGLE BUTTON ─────────────────────────────────────────────
toggleButton.Click:Connect(function()
	widget.Enabled = not widget.Enabled
	if widget.Enabled then
		if currentScreen == "login" then
			showLoginScreen()
		else
			showHomeScreen()
		end
	end
end)

-- ── INITIAL RENDER ────────────────────────────────────────────
if sessionToken ~= "" then
	showHomeScreen()
else
	showLoginScreen()
end

print("[XERON Engine v7] Plugin loaded — xeron-labs.com")
