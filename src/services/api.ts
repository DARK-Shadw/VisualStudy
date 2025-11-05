/**
 * API service layer for backend communication
 */
import axios from 'axios';
import type {
  CourseGenerationRequest,
  CourseGenerationResponse,
  GenerationStatus,
  Course
} from '../types/course.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const apiService = {
  /**
   * Health check
   */
  async healthCheck() {
    const response = await api.get('/api/health');
    return response.data;
  },

  /**
   * Generate a new course
   */
  async generateCourse(request: CourseGenerationRequest): Promise<CourseGenerationResponse> {
    const response = await api.post<CourseGenerationResponse>('/api/courses/generate', request);
    return response.data;
  },

  /**
   * Get course generation status
   */
  async getCourseStatus(courseId: string): Promise<GenerationStatus> {
    const response = await api.get<GenerationStatus>(`/api/courses/${courseId}/status`);
    return response.data;
  },

  /**
   * Get complete course data
   */
  async getCourse(courseId: string): Promise<any> {
    const response = await api.get(`/api/courses/${courseId}`);
    return response.data;
  },

  /**
   * Poll for course generation completion
   * Polls indefinitely until the course is completed or fails
   */
  async pollCourseGeneration(
    courseId: string,
    onProgress?: (status: GenerationStatus) => void,
    intervalMs: number = 2000
  ): Promise<any> {
    const poll = async (): Promise<any> => {
      try {
        const status = await this.getCourseStatus(courseId);

        // Call progress callback
        if (onProgress) {
          onProgress(status);
        }

        // Check if completed
        if (status.status === 'completed') {
          return await this.getCourse(courseId);
        }

        // Check if failed
        if (status.status === 'failed') {
          throw new Error('Course generation failed: ' + status.messages.join(', '));
        }

        // Keep polling - no timeout
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        return poll();
      } catch (error) {
        console.error('Polling error:', error);
        throw error;
      }
    };

    return poll();
  },
};

export default api;
