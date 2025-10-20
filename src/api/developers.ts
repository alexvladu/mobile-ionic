import axios from 'axios';
import { Developer } from '../types/developer';
import axiosInstance from '../interceptors/authInterceptor';


export class DeveloperService {
  private baseUrl = 'http://localhost:8080/api/developers';

  async fetchDevelopers(): Promise<Developer[]> {
    const res = await axiosInstance.get<Developer[]>(this.baseUrl);
    return res.data;
  }

  async createDeveloper(dev: Omit<Developer, 'id'>): Promise<Developer> {
    const res = await axiosInstance.post<Developer>(this.baseUrl, dev, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  }

  // Update an existing developer
  async updateDeveloper(id: number, dev: Developer): Promise<Developer> {
    const res = await axiosInstance.put<Developer>(`${this.baseUrl}/${id}`, dev, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  }

  // Delete a developer
  async deleteDeveloper(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }
}
