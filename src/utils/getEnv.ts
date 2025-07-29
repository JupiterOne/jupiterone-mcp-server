export const getEnv = () => {
  try {
    const baseUrl = process.env.JUPITERONE_BASE_URL;
    if (!baseUrl) {
      return undefined;
    }
    const env = baseUrl.split('graphql.')[1]?.split('.')[0];
    return env || undefined;
  } catch (error) {
    return undefined;
  }
};
