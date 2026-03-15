import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

// Test utilities
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Auth Service', () => {
  it('should export login function', async () => {
    const { authService } = await import('@/services/auth.service');
    expect(authService).toBeDefined();
    expect(typeof authService.login).toBe('function');
  });

  it('should export registerClient function', async () => {
    const { authService } = await import('@/services/auth.service');
    expect(typeof authService.registerClient).toBe('function');
  });

  it('should export logout function', async () => {
    const { authService } = await import('@/services/auth.service');
    expect(typeof authService.logout).toBe('function');
  });
});

describe('Booking Service', () => {
  it('should export createBooking function', async () => {
    const { bookingService } = await import('@/services/booking.service');
    expect(bookingService).toBeDefined();
    expect(typeof bookingService.createBooking).toBe('function');
  });

  it('should export getBookingById function', async () => {
    const { bookingService } = await import('@/services/booking.service');
    expect(typeof bookingService.getBookingById).toBe('function');
  });

  it('should export cancelBooking function', async () => {
    const { bookingService } = await import('@/services/booking.service');
    expect(typeof bookingService.cancelBooking).toBe('function');
  });

  it('should export rescheduleBooking function', async () => {
    const { bookingService } = await import('@/services/booking.service');
    expect(typeof bookingService.rescheduleBooking).toBe('function');
  });
});

describe('Provider Service', () => {
  it('should export getProviders function', async () => {
    const { providerService } = await import('@/services/provider.service');
    expect(providerService).toBeDefined();
    expect(typeof providerService.getProviders).toBe('function');
  });

  it('should export getProviderById function', async () => {
    const { providerService } = await import('@/services/provider.service');
    expect(typeof providerService.getProviderById).toBe('function');
  });
});

describe('Payment Service', () => {
  it('should export initializePayment function', async () => {
    const { paymentService } = await import('@/services/payment.service');
    expect(paymentService).toBeDefined();
    expect(typeof paymentService.initializePayment).toBe('function');
  });
});

describe('Service Service', () => {
  it('should export getServices function', async () => {
    const { serviceService } = await import('@/services/service.service');
    expect(serviceService).toBeDefined();
    expect(typeof serviceService.getServices).toBe('function');
  });
});

describe('Review Service', () => {
  it('should export createReview function', async () => {
    const { reviewService } = await import('@/services/review.service');
    expect(reviewService).toBeDefined();
    expect(typeof reviewService.createReview).toBe('function');
  });
});

describe('Availability Service', () => {
  it('should export getAvailableSlots function', async () => {
    const { availabilityService } = await import('@/services/availability.service');
    expect(availabilityService).toBeDefined();
    expect(typeof availabilityService.getAvailableSlots).toBe('function');
  });
});

describe('Client Service', () => {
  it('should export getProfile function', async () => {
    const { clientService } = await import('@/services/client.service');
    expect(clientService).toBeDefined();
    expect(typeof clientService.getProfile).toBe('function');
  });
});

describe('Form Validation', () => {
  it('should validate email format', () => {
    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
  });

  it('should validate phone number format', () => {
    const isValidPhone = (phone: string) => {
      const phoneRegex = /^\+?[1-9]\d{6,14}$/;
      return phoneRegex.test(phone.replace(/[\s-]/g, ''));
    };

    expect(isValidPhone('+1234567890')).toBe(true);
    expect(isValidPhone('1234567890')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
  });

  it('should validate password strength', () => {
    const isValidPassword = (password: string) => {
      return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
      );
    };

    expect(isValidPassword('Password123!')).toBe(true);
    expect(isValidPassword('weak')).toBe(false);
    expect(isValidPassword('NoNumbers!')).toBe(false);
    expect(isValidPassword('nouppercase1!')).toBe(false);
  });
});

describe('Date Utilities', () => {
  it('should format date correctly', () => {
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    };

    const testDate = new Date('2024-01-15');
    expect(formatDate(testDate)).toBe('January 15, 2024');
  });

  it('should calculate time difference', () => {
    const getHoursUntil = (targetDate: Date) => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      return Math.ceil(diff / (1000 * 60 * 60));
    };

    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 24);
    
    expect(getHoursUntil(futureDate)).toBeGreaterThanOrEqual(23);
  });
});

describe('Currency Formatting', () => {
  it('should format Naira currency', () => {
    const formatNaira = (amount: number) => {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
      }).format(amount);
    };

    expect(formatNaira(5000)).toContain('5,000');
    expect(formatNaira(100000)).toContain('100,000');
  });
});

describe('Booking Flow Validation', () => {
  it('should validate booking time slot format', () => {
    const isValidTimeFormat = (time: string) => {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      return timeRegex.test(time);
    };

    expect(isValidTimeFormat('10:00')).toBe(true);
    expect(isValidTimeFormat('23:59')).toBe(true);
    expect(isValidTimeFormat('9:00')).toBe(false);
    expect(isValidTimeFormat('25:00')).toBe(false);
  });

  it('should validate booking date is not in past', () => {
    const isValidBookingDate = (date: string) => {
      const bookingDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return bookingDate >= today;
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    expect(isValidBookingDate(tomorrow.toISOString().split('T')[0])).toBe(true);
    expect(isValidBookingDate('2020-01-01')).toBe(false);
  });

  it('should validate end time is after start time', () => {
    const isEndAfterStart = (startTime: string, endTime: string) => {
      const toMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      return toMinutes(endTime) > toMinutes(startTime);
    };

    expect(isEndAfterStart('10:00', '11:00')).toBe(true);
    expect(isEndAfterStart('11:00', '10:00')).toBe(false);
    expect(isEndAfterStart('10:00', '10:30')).toBe(true);
  });
});

describe('Query Keys', () => {
  it('should export query key constants', async () => {
    const { queryKeys } = await import('@/constants/queryKeys');
    expect(queryKeys).toBeDefined();
    expect(queryKeys.providers).toBeDefined();
    expect(queryKeys.bookings).toBeDefined();
    expect(queryKeys.services).toBeDefined();
  });
});
