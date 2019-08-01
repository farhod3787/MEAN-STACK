import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from "@angular/router";


import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'
import { Post } from './post.model';
import { formatDate } from '@angular/common';

@Injectable({ providedIn: 'root' })

export class PostsService {
      
        private posts: Post[] = [];
        private postUpdates = new Subject<Post[]>()
        s
        constructor(private http: HttpClient ,   private router : Router) {
        }
        getPost1(id: string) {
                console.log(id);
                return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(
                        'http://localhost:5000/api/posts/' + id
                );
              }
      
        getPost(postsPerPage :number, currentPage : number) {
                 const queryParams  = `?pagesize=${postsPerPage}&page=${currentPage}`;
                this.http
                        .get<{ message: string, posts: any }>('http://localhost:5000/api/posts' + queryParams )
                        .pipe(map((postData) => {
                                return postData.posts
                                        .map(post => {
                                                return {
                                                        title: post.title,
                                                        content: post.content,
                                                        id: post._id,
                                                        imagePath: post.imagePath
                                                };
                                        });
                        }))
                        .subscribe((transformedPost) => {
                                this.posts = transformedPost;
                                this.postUpdates.next([...this.posts]);
                        })
        }
        addPost(title: string, content: string, image: File) {
                const postData = new FormData();
                 postData.append("title", title);
                 postData.append("content", content);
                 postData.append("image", image, title );
         
                 this.http
                        .post<{ message: string, post: Post }>('http://localhost:5000/api/posts', postData)
                        .subscribe(responseData => {
                                const post: Post = {
                                        id: responseData.post.id, 
                                        title: title, 
                                        content: content,
                                        imagePath: responseData.post.imagePath
                                }
                                console.log(responseData.message);
                                this.posts.push(post);
                                this.postUpdates.next([...this.posts]);
                                this.router.navigate(['/']);
                        })
        }
        getPostUpdateListener() {
                return this.postUpdates.asObservable();
        }

        updatePost(id: string, title: string, content: string, image: File | string ) {
               let postData : Post | FormData;
                if (typeof(image) === "object") {
                        postData = new FormData();
                        postData.append("title", title);
                        postData.append("content", content);
                        postData.append("image", image, title);
                }
                else {
                        postData = {
                                id: id, 
                                title: title, 
                                content: content, 
                                imagePath: image
                        };
                }
                this.http.put('http://localhost:5000/api/posts/' + id, postData)
                        .subscribe(response => { 
                                const updatedPost = [...this.posts];
                                const oldPostIndex = updatedPost.findIndex( p => p.id ===  id );
                                const post : Post = {
                                        id: id, 
                                        title: title, 
                                        content: content, 
                                        imagePath: ""
                                } 
                                updatedPost[oldPostIndex] = post;
                                this.posts = updatedPost;
                                this.postUpdates.next([...this.posts]);
                                this.router.navigate(['/']);                                
                        });
        }

        deletePost(postId: String) {
                return this.http.delete('http://localhost:5000/api/posts/' + postId);

                // this.http.delete('http://localhost:5000/api/posts/' + postId)
                //         .subscribe(() => {
                //                 console.log("Post Deleted");
                //                 // this.getPost();

                //                  const updatePost = this.posts.filter( post =>{ post.id !== postId});
                //                      this.posts = updatePost;
                //                      this.postUpdates.next([...this.posts]);                  
                //         });
        }

        editPost(id: String) {
                return  this.http.get<{_id: string, title: string, content: string}>('http://localhost:5000/api/posts/' + id);
        }
} 