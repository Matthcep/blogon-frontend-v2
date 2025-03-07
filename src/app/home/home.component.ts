import { Component, OnInit } from '@angular/core';
import { BlogService } from 'app/services/blog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'app/services/category.service';
import Swal from 'sweetalert2'


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

  showForm = false;
  blogSelected: any;
  title: any;
  isEditing = false;

  constructor(private blogService: BlogService, private fb: FormBuilder, private categoryService: CategoryService) { }

  ngOnInit() {

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

    this.uploadBlogs();
      
  }

  uploadBlogs() {
    this.blogService.getBlogs().subscribe((data) => {
      this.blogs = data;
    });
  }

  onSubmit(): void {
    // Maneja el envío del formulario
    if (this.blogForm.valid) {
      const updatedBlog = this.blogForm.value;

      console.log('Blog actualizado:', updatedBlog);
      console.log(updatedBlog.category.id );
      
      updatedBlog.id = this.blogSelected?.id;

      this.blogService.saveBlog(updatedBlog, this.isEditing).subscribe(
        (response) => {
          console.log('Blog actualizado:', response);          
          this.blogForm.reset();
          this.uploadBlogs();
          Swal.fire({
            title: 'Información',
            text: 'El blog se ha creado correctamente',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showForm = false;
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al crear el blog',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
      );
    }
  }

  addBlog(): void {
    this.title = 'Agregar Blog';
    this.blogForm.reset();
    this.showForm = true;
    this.isEditing = false;
  }

  editBlog(blog: any): void {
    this.title = 'Editar Blog';
    this.blogSelected = blog;
    this.blogForm = this.fb.group({
      title: [this.blogSelected.title, Validators.required],
      image: [this.blogSelected.image],
      resume: [this.blogSelected.resume, Validators.required],
      content: [this.blogSelected.content, Validators.required],  
      category: [this.blogSelected.category, Validators.required]
    });
    this.showForm = true;
    this.isEditing = true;
  }

  cancelAddBlog(): void {
    this.showForm = false;
    this.blogForm.reset();
  }

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

  deleteBlog(blog: any): void {
    this.blogSelected = blog;
    Swal.fire({
      title: "Esta seguro de eliminar el Blog?",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.blogService.deleteBlog(this.blogSelected.id).subscribe(
          (response) => {
            console.log('Blog eliminado:', response);
            this.uploadBlogs();
            Swal.fire({
              title: 'Información',
              text: 'El blog se ha eliminado correctamente',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          },
          (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al eliminar el blog',
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
        );
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

}
