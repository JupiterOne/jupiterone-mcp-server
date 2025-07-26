const { DashboardService } = require('../../dist/client/services/dashboard-service.js');

describe('Dashboard URL Construction', () => {
  let dashboardService;

  beforeEach(() => {
    const mockClient = {};
    dashboardService = new DashboardService(mockClient);
  });

  describe('constructDashboardUrl', () => {
    it('should construct URL with provided subdomain', () => {
      const dashboardId = '6101fdba-e7bb-4f64-a9fb-62ba5f0641a2';
      const subdomain = 'ripple-4e';
      
      const url = dashboardService.constructDashboardUrl(dashboardId, subdomain);
      
      expect(url).toBe('https://ripple-4e.apps.us.jupiterone.io/insights/dashboards/6101fdba-e7bb-4f64-a9fb-62ba5f0641a2');
    });

    it('should default to j1 subdomain when not provided', () => {
      const dashboardId = '6101fdba-e7bb-4f64-a9fb-62ba5f0641a2';
      
      const url = dashboardService.constructDashboardUrl(dashboardId);
      
      expect(url).toBe('https://j1.apps.us.jupiterone.io/insights/dashboards/6101fdba-e7bb-4f64-a9fb-62ba5f0641a2');
    });

    it('should handle undefined subdomain', () => {
      const dashboardId = '6101fdba-e7bb-4f64-a9fb-62ba5f0641a2';
      
      const url = dashboardService.constructDashboardUrl(dashboardId, undefined);
      
      expect(url).toBe('https://j1.apps.us.jupiterone.io/insights/dashboards/6101fdba-e7bb-4f64-a9fb-62ba5f0641a2');
    });
  });
});