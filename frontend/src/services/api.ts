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

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    const res = await client.get('/health');
    return res.data;
  }
};
