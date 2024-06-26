import mongoose, { Schema, Document } from 'mongoose';

// Define the Like interface
interface Like {
  userId: string;
  userName: string;
  userImage?: string;
}

// Define the Comment interface
interface Comment {
  userId: string;
  userName: string;
  userImage?: string;
  text: string;
  createdAt?: Date;
}

// Define the FriendRequest interface
interface FriendRequest {
  senderId: string;
  senderName: string;
  senderImage?: string;
}

// Define the Post interface
interface Post {
  _id: mongoose.Schema.Types.ObjectId;
  caption: string;
  photos: string[];
  likes: Like[];
  comments: Comment[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Extend the Document interface to include our custom fields
interface User extends Document {
  name: string;
  email: string;
  password: string;
  uid: string;
  roles: number[];
  is_admin: boolean;
  active: boolean;
  softDelete: boolean;
  LastLoginAt: Date;
  refreshToken?: string;
  sAccessToken?: string;
  issueAt?: number;
  occupation?: string;
  deleteAt?: string;
  provider?: string;
  image?: string;
  bio?: string;
  LastLoginIp?: string;
  city?: string;
  state?: string;
  country?: string;
  phoneNumber?: string;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: string;
  verifyToken?: string;
  verifyTokenExpiry?: string;
  userPosts: Post[];
  friendRequests: FriendRequest[];
}

// Define the friendRequestSchema
const friendRequestSchema: Schema = new Schema(
  {
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderImage: { type: String },
  },
  { _id: false }
);

// Define the likeSchema
const likeSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userImage: { type: String },
  },
  { _id: false }
);

// Define the commentSchema
const commentSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userImage: { type: String },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Define the postSchema
const postSchema: Schema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    caption: { type: String, required: true },
    photos: { type: [String], required: true },
    likes: [likeSchema],
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Define the userSchema
const userSchema: Schema = new Schema(
  {
    name: { type: String, default: 'Anonymous', minlength: 3, maxlength: 100, required: true },
    email: { type: String, match: /.+\@.+\..+/, unique: true, minlength: 5, maxlength: 100, required: true },
    password: { type: String, minlength: 5 },
    uid: { type: String, unique: true },
    roles: { type: [Number], default: [] },
    is_admin: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    softDelete: { type: Boolean, default: false },
    LastLoginAt: { type: Date, default: Date.now },
    refreshToken: { type: String },
    sAccessToken: { type: String },
    issueAt: { type: Number, default: 101010 },
    occupation: { type: String },
    deleteAt: { type: String },
    provider: { type: String },
    image: { type: String },
    bio: { type: String },
    LastLoginIp: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    phoneNumber: { type: String },
    forgotPasswordToken: { type: String },
    forgotPasswordTokenExpiry: { type: String },
    verifyToken: { type: String },
    verifyTokenExpiry: { type: String },
    userPosts: [postSchema],
    friendRequests: [friendRequestSchema],
  },
  { timestamps: true }
);

// Export the User model
export default mongoose.models.User || mongoose.model<User>('User', userSchema);
