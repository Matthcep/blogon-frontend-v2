import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private apiUrl = 'http://localhost:8080/api/blogs';

  constructor(private http: HttpClient) { }

  getBlogs(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getBlogDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateBlog(id: number, blog: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, blog);
  }

  saveBlog(blog: any, isEditing:boolean): Observable<any> {
    if (isEditing) {
      return this.updateBlog(blog.id, blog);
    }
    return this.http.post<any>(this.apiUrl, blog);
  }

  deleteBlog(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
}
}