import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// Type definitions for function parameters and returns
export interface CreateJobParams {
  type: 'udio' | 'runway' | 'deepmotion' | 'tts';
  prompt?: string;
  file?: File;
  params?: Record<string, any>;
}

export interface CreateJobResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedDuration?: number;
}

export interface GetRtcTokenParams {
  channelName: string;
  uid?: number;
  role?: 'host' | 'audience';
}

export interface GetRtcTokenResponse {
  token: string;
  channelName: string;
  uid: number;
  expiration: number;
}

export interface GetUploadUrlParams {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface GetUploadUrlResponse {
  uploadUrl: string;
  downloadUrl: string;
  fileId: string;
}

// Function wrappers with error handling
export const createJob = async (params: CreateJobParams): Promise<CreateJobResponse> => {
  try {
    const createJobFunction = httpsCallable<CreateJobParams, CreateJobResponse>(functions, 'createJob');
    const result = await createJobFunction(params);
    return result.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw new Error('Failed to create job. Please try again.');
  }
};

export const getRtcToken = async (params: GetRtcTokenParams): Promise<GetRtcTokenResponse> => {
  try {
    const url = `https://europe-west1-akilipesa-prod.cloudfunctions.net/getRtcToken`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        channel: params.channelName,
        uid: params.uid
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      token: data.token,
      uid: parseInt(data.uid),
      appId: data.appId
    };
  } catch (error) {
    console.error('Error getting RTC token:', error);
    throw new Error('Failed to get call token. Please try again.');
  }
};

export const getUploadUrl = async (params: GetUploadUrlParams): Promise<GetUploadUrlResponse> => {
  try {
    const getUploadUrlFunction = httpsCallable<GetUploadUrlParams, GetUploadUrlResponse>(functions, 'getUploadUrl');
    const result = await getUploadUrlFunction(params);
    return result.data;
  } catch (error) {
    console.error('Error getting upload URL:', error);
    throw new Error('Failed to get upload URL. Please try again.');
  }
};

// Helper function to handle file uploads
export const uploadFile = async (file: File): Promise<string> => {
  try {
    const uploadUrlData = await getUploadUrl({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    const response = await fetch(uploadUrlData.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return uploadUrlData.downloadUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file. Please try again.');
  }
};
