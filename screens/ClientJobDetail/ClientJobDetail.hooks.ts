export const useClientJobDetail = (route: any, navigation: any) => {
  const { client } = route.params || {};

  const handleNavigateToSummary = () => {
    navigation.navigate('SummaryScreen', { 
      client, 
      photos: { pointA: null, pointB: null, pointC: null } 
    });
  };

  const handleNavigateToVisualisation = () => {
    navigation.navigate('Visualisation', { client });
  };

  return {
    client,
    handleNavigateToSummary,
    handleNavigateToVisualisation,
  };
};