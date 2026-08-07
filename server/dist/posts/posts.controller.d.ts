import { PostsService } from './posts.service';
export declare class PostsController {
    private postsService;
    constructor(postsService: PostsService);
    getFeed(category?: string): Promise<{
        id: string;
        title: string;
        image: string;
        caption: string;
        category: string;
        tags: string[];
        author: {
            id: string;
            username: string;
            name: string;
            avatar: string;
        };
        exif: {
            id: string;
            postId: string;
            camera: string | null;
            lens: string | null;
            aperture: string | null;
            shutter: string | null;
            iso: string | null;
        };
        likes: number;
        comments: number;
        createdAt: Date;
    }[]>;
    getTopCategories(): Promise<{
        name: string;
        count: number;
    }[]>;
    getOne(id: string): Promise<{
        likesCount: number;
        comments: ({
            user: {
                username: string;
                name: string;
                avatar: string;
            };
        } & {
            id: string;
            createdAt: Date;
            postId: string;
            content: string;
            userId: string;
        })[];
        author: {
            id: string;
            username: string;
            name: string;
            avatar: string;
            bio: string;
        };
        exif: {
            id: string;
            postId: string;
            camera: string | null;
            lens: string | null;
            aperture: string | null;
            shutter: string | null;
            iso: string | null;
        };
        _count: {
            likes: number;
        };
        id: string;
        createdAt: Date;
        title: string;
        image: string;
        caption: string | null;
        category: string;
        tags: string[];
        authorId: string;
    }>;
    create(req: any, body: {
        title: string;
        image: string;
        caption?: string;
        category: string;
        tags?: string[];
        camera?: string;
        lens?: string;
        aperture?: string;
        shutter?: string;
        iso?: string;
    }): Promise<{
        author: {
            username: string;
            name: string;
            avatar: string;
        };
        exif: {
            id: string;
            postId: string;
            camera: string | null;
            lens: string | null;
            aperture: string | null;
            shutter: string | null;
            iso: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        title: string;
        image: string;
        caption: string | null;
        category: string;
        tags: string[];
        authorId: string;
    }>;
    toggleLike(req: any, id: string): Promise<{
        liked: boolean;
    }>;
    addComment(req: any, id: string, content: string): Promise<{
        user: {
            username: string;
            name: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        postId: string;
        content: string;
        userId: string;
    }>;
}
