# 🛡️ GitHub Repository Security Lockdown Guide
### Project: `hengsna/subscription`
### Author: `chanveasnaheng19-9108` (`chanveasnaheng19@gmail.com`)

Follow these 4 essential steps in your GitHub repository settings to permanently prevent unauthorized pushes, malicious pull requests, and virus injections.

---

## Step 1: Lock the `main` Branch (Prevent Direct Pushing)

1. Open your repository on GitHub:
   👉 **https://github.com/hengsna/subscription/settings/branches**
2. Click **Add branch protection rule** (or **New branch ruleset**).
3. Under **Branch name pattern**, enter: `main`
4. Enable the following checkboxes:
   - ✅ **Require a pull request before merging**
     - Require approvals: `1`
     - Dismiss stale pull request approvals when new commits are pushed: `Checked`
   - ✅ **Require status checks to pass before merging**
     - Require branches to be up to date before merging: `Checked`
     - In the search box, select the automated checks:
       - `CodeQL Static Application Security Testing (SAST)`
       - `Dependency Audit & Secret Scan`
   - ✅ **Require signed commits** (ensures only you can sign and commit code).
   - ✅ **Do not allow bypassing the above settings** (applies rules to repository administrators too).
   - ✅ **Restrict who can push to matching branches** (specify only your account: `chanveasnaheng19-9108`).
5. Click **Save changes** (or **Create**).

> [!IMPORTANT]
> Once this is enabled, **nobody** (not even an attacker who steals a token) can push code directly or overwrite the `main` branch with malicious files or viruses.

---

## Step 2: Enable Push Protection & Secret Scanning

1. Open:
   👉 **https://github.com/hengsna/subscription/settings/security_analysis**
2. Enable the following security features:
   - ✅ **Secret scanning**: Detects leaked API keys or passwords.
   - ✅ **Push protection**: **BLOCKS** any git push containing credentials or tokens BEFORE it reaches GitHub.
   - ✅ **Dependabot alerts**: Warns you if an npm dependency develops a vulnerability.
   - ✅ **Dependabot security updates**: Automatically opens pull requests to patch security flaws.
   - ✅ **Code scanning (CodeQL)**: Set to Active / Advanced using the `.github/workflows/security.yml` workflow we added.

---

## Step 3: Enforce Account Two-Factor Authentication (2FA)

1. Open your GitHub account security settings:
   👉 **https://github.com/settings/security**
2. Ensure **Two-factor authentication (2FA)** is **Enabled** (using Google Authenticator or an SMS/Security Key).
3. Under **SSH and GPG keys**, verify that only your trusted computers have active SSH keys. Remove any old or unrecognized keys.

---

## Step 4: Verify Local Git Credentials

To ensure only your authenticated account pushes:
```bash
git config --global user.name "chanveasnaheng19-9108"
git config --global user.email "chanveasnaheng19@gmail.com"
```

Use a **Personal Access Token (Fine-Grained)** or **SSH Key** with repository-scoped permissions rather than full account access.
