# MCP Server Setup Instructions

This project is configured to use Model Context Protocol (MCP) servers to enhance Claude Code's capabilities.

## Configured MCP Servers

### 1. GitHub MCP Server
Provides access to GitHub repository data, including:
- Commit history and diffs
- Pull requests and issues
- Repository files and structure
- Branch information

**Repository**: `ittapopo/mafios`

### 2. Git MCP Server
Provides local Git operations:
- View commit history
- Check repository status
- Show diffs and changes
- Branch management

### 3. Filesystem MCP Server
Enhanced filesystem access for this project directory.

## Setup Instructions

### Step 1: Create a GitHub Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a descriptive name (e.g., "MCP Server - Mafios")
4. Set expiration as needed
5. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
   - `read:user` (Read user profile data)
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again!)

### Step 2: Configure the MCP Server

1. Open `.mcp.json` in the project root
2. Replace `<YOUR_GITHUB_TOKEN_HERE>` with your actual GitHub token
3. Save the file

**Important**: The `.mcp.json` file contains your GitHub token. Make sure it's in `.gitignore`!

### Step 3: Verify MCP Configuration

The MCP servers will be automatically loaded when you use Claude Code in this project.

You can verify by asking Claude Code to:
- "Show me the recent commit history" (uses GitHub MCP)
- "What changes were made in the last commit?" (uses Git MCP)
- "List the files in the project" (uses Filesystem MCP)

## Security Notes

- **Never commit your GitHub token** to version control
- The `.mcp.json` file is already added to `.gitignore`
- Keep your token secure and rotate it regularly
- Use tokens with minimal required permissions

## Troubleshooting

### MCP servers not working?
1. Ensure Node.js is installed (`node --version`)
2. Check that `npx` is available
3. Verify your GitHub token is valid
4. Restart Claude Code

### GitHub API rate limits?
If you hit rate limits, the token will help increase your limit from 60 to 5,000 requests per hour.

## Available MCP Commands

Once configured, Claude Code can:
- Read commit messages and history
- Analyze code changes over time
- Search through issues and PRs
- View file contents from any commit
- Compare branches and diffs
- Track project evolution
