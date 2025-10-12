// src/api/developers.ts
import axios from 'axios';
import { Developer } from '../types/developer';

export class DeveloperService {
  private baseUrl = 'http://localhost:8080/api/developers'; // endpoint Quarkus

  async fetchDevelopers(): Promise<Developer[]> {
    const res = await axios.get<Developer[]>(this.baseUrl);
    return res.data;
  }

  // Create a new developer
  async createDeveloper(dev: Omit<Developer, 'id'>): Promise<Developer> {
    const res = await axios.post<Developer>(this.baseUrl, dev, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  }

  // Update an existing developer
  async updateDeveloper(id: number, dev: Developer): Promise<Developer> {
    const res = await axios.put<Developer>(`${this.baseUrl}/${id}`, dev, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  }

  // Delete a developer
  async deleteDeveloper(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}
