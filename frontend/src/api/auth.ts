export const authApi = {
  loginWithGithub: () => {
    const oauthUrl = import.meta.env.VITE_OAUTH2_GITHUB_URL;
    if (!oauthUrl) {
      throw new Error("VITE_OAUTH2_GITHUB_URL is missing in .env");
    }
    window.location.href = oauthUrl;
  }
};
