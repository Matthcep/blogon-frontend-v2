import { Component, OnInit } from '@angular/core';
import { BlogService } from 'app/services/blog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'app/services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
   
  blogs: any = [];
  categories: any = [];
  // constructor
  blogForm!: FormGroup;
  blogId: number = 0;
  blogDetails: any;

  constructor(private blogService: BlogService, private fb: FormBuilder, private categoryService: CategoryService) { }

  ngOnInit() {

    this.blogService.getBlogs().subscribe((data) => {
      this.blogs = data;
      console.log(this.blogs);
      
    });

    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      console.log(this.categories);
      
    });



    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      image: [''],
      resume: ['', Validators.required],
      content: ['', Validators.required],  
      category: [null, Validators.required]
    });
      
  }

  onSubmit(): void {
    // Maneja el envío del formulario
    if (this.blogForm.valid) {
      const updatedBlog = this.blogForm.value;
      this.blogService.updateBlog(this.blogId, updatedBlog).subscribe(
        (response) => {
          console.log('Blog actualizado:', response);
          alert('Blog actualizado exitosamente');
        },
        (error) => {
          console.error('Error al actualizar el blog:', error);
        }
      );
    }
  }

  // Maneja el cambio de imagen
  onImageChange(event: any): void {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.blogForm.patchValue({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

}
