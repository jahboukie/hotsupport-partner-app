import { loadStripe } from '@stripe/stripe-js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3021';

export interface CreateSubscriptionRequest {
  paymentMethodId: string;
  priceId: string;
}

export interface SubscriptionResponse {
  id: string;
  status: string;
  client_secret?: string;
  error?: string;
}

export const createSubscription = async (data: CreateSubscriptionRequest): Promise<SubscriptionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating subscription:', error);
    return {
      id: '',
      status: 'error',
      error: 'Failed to create subscription. Please try again.',
    };
  }
};

export const getSubscriptionStatus = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return { status: 'error', error: 'Failed to fetch subscription status' };
  }
};

export const cancelSubscription = async (subscriptionId: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return { success: false, error: 'Failed to cancel subscription' };
  }
};