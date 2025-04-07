import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FILE_TYPES } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  validateFile(file: File): { valid: boolean; message?: string } {
    if (!file) {
      return { valid: false, message: 'No file selected' };
    }

    if (!FILE_TYPES.IMAGE.includes(file.type)) {
      return { valid: false, message: 'Invalid file type. Only JPEG, PNG, and GIF files are allowed' };
    }

    if (file.size > FILE_TYPES.MAX_SIZE) {
      return { valid: false, message: 'File size exceeds 5MB limit' };
    }

    return { valid: true };
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
  }

  generateFileName(originalName: string): string {
    const timestamp = new Date().getTime();
    const extension = this.getFileExtension(originalName);
    return `${timestamp}.${extension}`;
  }
} 