export const getEnv = () => {
  try {
    const baseUrl = process.env.JUPITERONE_BASE_URL || 'https://graphql.dev.jupiterone.io';
    const env = baseUrl.split('graphql.')[1].split('.')[0];
    return env || 'us';
  } catch (error) {
    console.error('Error getting environment:', error);
    return 'us';
  }
};
