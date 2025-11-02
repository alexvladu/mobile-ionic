import axios from 'axios';
import { Developer, DeveloperPaginated } from '../types/developer';
import axiosInstance from '../interceptors/authInterceptor';


export class DeveloperService {
  private baseUrl = 'http://localhost:8080/api/developers';

  async fetchDevelopers(page:number, size:number, searchName:string|null, filterFullStack:string|null): Promise<DeveloperPaginated> {
    let path=`${this.baseUrl}?page=${page}&size=${size}`;
    if(searchName)
      path=path+`&name=${searchName}`;
    if(filterFullStack=="true" || filterFullStack=="false")
      path=path+`&fullStack=${filterFullStack}`;
    const res = await axiosInstance.get<DeveloperPaginated>(path);
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
