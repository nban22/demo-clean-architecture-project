// src/services/api.js
import axios from 'axios';

// Cấu hình base URL cho API
const API = axios.create({
  baseURL: 'https://localhost:7233/api',
});

// Các API calls cho Book
export const getBooks = async () => {
  try {
    const response = await API.get('/books');
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await API.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with id ${id}:`, error);
    throw error;
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await API.post('/books', bookData);
    return response.data;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const response = await API.put(`/books/${id}`, bookData);
    return response.data;
  } catch (error) {
    console.error(`Error updating book with id ${id}:`, error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await API.delete(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting book with id ${id}:`, error);
    throw error;
  }
};


// src/services/api.js (bổ sung thêm)

// Reader API Calls
export const getReaders = async () => {
    try {
      const response = await API.get('/readers');
      return response.data;
    } catch (error) {
      console.error('Error fetching readers:', error);
      throw error;
    }
  };
  
  export const getReaderById = async (id) => {
    try {
      const response = await API.get(`/readers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reader with id ${id}:`, error);
      throw error;
    }
  };
  
  export const createReader = async (readerData) => {
    try {
      const response = await API.post('/readers', readerData);
      return response.data;
    } catch (error) {
      console.error('Error creating reader:', error);
      throw error;
    }
  };
  
  export const updateReader = async (id, readerData) => {
    try {
      const response = await API.put(`/readers/${id}`, readerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating reader with id ${id}:`, error);
      throw error;
    }
  };
  
  export const deleteReader = async (id) => {
    try {
      const response = await API.delete(`/readers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting reader with id ${id}:`, error);
      throw error;
    }
  };
  
  // Loan API Calls
  export const getLoans = async () => {
    try {
      const response = await API.get('/loans');
      return response.data;
    } catch (error) {
      console.error('Error fetching loans:', error);
      throw error;
    }
  };
  
  export const getActiveLoans = async () => {
    try {
      const response = await API.get('/loans/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active loans:', error);
      throw error;
    }
  };
  
  export const getLoanById = async (id) => {
    try {
      const response = await API.get(`/loans/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching loan with id ${id}:`, error);
      throw error;
    }
  };
  
  export const createLoan = async (loanData) => {
    try {
      const response = await API.post('/loans', loanData);
      return response.data;
    } catch (error) {
      console.error('Error creating loan:', error);
      throw error;
    }
  };
  
  export const returnBook = async (id) => {
    try {
      const response = await API.post(`/loans/${id}/return`);
      return response.data;
    } catch (error) {
      console.error(`Error returning book for loan id ${id}:`, error);
      throw error;
    }
  };