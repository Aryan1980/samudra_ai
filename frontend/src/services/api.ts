import axios from 'axios';
import {
  ChatResponse,
  Coordinates,
  MarineObservation,
  WeatherReport,
  PFZZone,
  MarineAlert,
  RiskAssessment,
  RouteComparison,
  DataSourceInfo
} from '../types/marine';

const getInitialBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    // If running on Vite dev server with proxy (typically :5173), use relative /api
    // If running on backend server (typically :8000), use relative /api
    // If deployed on Vercel / custom domain, use relative /api
    const isViteDev = window.location.port === '5173';
    if (isViteDev) {
      return '/api';
    }
    return '/api';
  }
  return 'http://127.0.0.1:8000/api';
};

const API_BASE = getInitialBaseUrl();

export const getApiBaseUrl = () => API_BASE;

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fallback interceptor: If relative /api fails on dev with connection refused, try direct 127.0.0.1:8000/api
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || config.__isRetry) {
      return Promise.reject(error);
    }

    // If request failed on /api due to Vite proxy not reaching backend, try direct localhost backend
    if (
      typeof window !== 'undefined' &&
      window.location.port === '5173' &&
      config.baseURL === '/api' &&
      (!error.response || error.code === 'ERR_NETWORK')
    ) {
      config.__isRetry = true;
      config.baseURL = 'http://127.0.0.1:8000/api';
      return axios(config);
    }

    return Promise.reject(error);
  }
);

export const api = {
  async sendChat(query: string, coords: Coordinates, language: string = 'en', activeLayers: string[] = []): Promise<ChatResponse> {
    const res = await client.post<ChatResponse>('/chat', {
      query,
      latitude: coords.latitude,
      longitude: coords.longitude,
      language,
      active_layers: activeLayers,
    });
    return res.data;
  },

  async getMarineConditions(coords: Coordinates) {
    const res = await client.get('/marine-conditions', {
      params: { lat: coords.latitude, lon: coords.longitude }
    });
    return res.data;
  },

  async getWeather(coords: Coordinates): Promise<WeatherReport> {
    const res = await client.get<WeatherReport>('/weather', {
      params: { lat: coords.latitude, lon: coords.longitude }
    });
    return res.data;
  },

  async getOcean(coords: Coordinates): Promise<MarineObservation> {
    const res = await client.get<MarineObservation>('/ocean', {
      params: { lat: coords.latitude, lon: coords.longitude }
    });
    return res.data;
  },

  async getPFZs(coords: Coordinates, sortBy: string = 'distance'): Promise<PFZZone[]> {
    const res = await client.get<PFZZone[]>('/pfz', {
      params: { lat: coords.latitude, lon: coords.longitude, sort_by: sortBy }
    });
    return res.data;
  },

  async getAlerts(coords: Coordinates): Promise<MarineAlert[]> {
    const res = await client.get<MarineAlert[]>('/alerts', {
      params: { lat: coords.latitude, lon: coords.longitude }
    });
    return res.data;
  },

  async getGeofences() {
    const res = await client.get('/geofences');
    return res.data;
  },

  async assessRisk(coords: Coordinates): Promise<RiskAssessment> {
    const res = await client.post<RiskAssessment>('/risk', coords);
    return res.data;
  },

  async calculateRoute(origin: Coordinates, destination: Coordinates): Promise<RouteComparison> {
    const res = await client.post<RouteComparison>('/route', { origin, destination });
    return res.data;
  },

  async getDataSources(): Promise<DataSourceInfo[]> {
    const res = await client.get<DataSourceInfo[]>('/data-sources');
    return res.data;
  },

  async checkHealth() {
    const res = await client.get('/health', { timeout: 4000 });
    return res.data;
  }
};

