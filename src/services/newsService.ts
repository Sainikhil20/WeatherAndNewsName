import { NewsResponse, NewsCategory, NewsArticle } from '../types';

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Demo news data for when API is not available (like in web browser due to CORS)
const DEMO_NEWS_DATA: NewsArticle[] = [
  {
    source: { id: 'demo', name: 'Science News' },
    author: 'Science Reporter',
    title: 'Scientists Surprised by Breakthrough in Climate Research',
    description: 'Researchers were surprised to discover unexpected developments in renewable energy technology that could revolutionize the field.',
    url: 'https://example.com/climate-breakthrough',
    urlToImage: 'https://via.placeholder.com/400x200/0066cc/ffffff?text=Climate+Research',
    publishedAt: new Date().toISOString(),
    content: 'Scientists have announced a surprising breakthrough in renewable energy research...'
  },
  {
    source: { id: 'demo', name: 'Tech News' },
    author: 'Tech Reporter',
    title: 'Amazing Innovation Surprises Technology Industry',
    description: 'A leading technology company has unveiled an amazing innovation that surprised industry experts and promises to revolutionize the field.',
    url: 'https://example.com/tech-innovation',
    urlToImage: 'https://via.placeholder.com/400x200/ff6600/ffffff?text=Tech+Innovation',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    content: 'The surprising new technology promises to change how we interact with digital devices...'
  },
  {
    source: { id: 'demo', name: 'Health News' },
    author: 'Health Editor',
    title: 'Unexpected Discovery Shows Surprising Health Benefits',
    description: 'Researchers made an unexpected discovery about the surprising benefits of a common daily activity that shocked the medical community.',
    url: 'https://example.com/health-study',
    urlToImage: 'https://via.placeholder.com/400x200/00cc66/ffffff?text=Health+Study',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    content: 'The unexpected study results surprised participants and researchers alike...'
  },
  {
    source: { id: 'demo', name: 'Sports Network' },
    author: 'Sports Writer',
    title: 'Incredible Victory Surprises Championship Fans',
    description: 'The home team secured an incredible victory in a championship game that surprised fans and experts with unexpected overtime drama.',
    url: 'https://example.com/championship-win',
    urlToImage: 'https://via.placeholder.com/400x200/cc0066/ffffff?text=Championship+Win',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    content: 'In a surprising finish, the local team emerged victorious in an incredible match...'
  },
  {
    source: { id: 'demo', name: 'Mystery News' },
    author: 'Investigation Team',
    title: 'Mysterious Phenomenon Surprises Scientists Worldwide',
    description: 'An unusual and mysterious phenomenon has surprised scientists around the world, leading to unprecedented research efforts.',
    url: 'https://example.com/mystery-phenomenon',
    urlToImage: 'https://via.placeholder.com/400x200/666666/ffffff?text=Mystery+News',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    content: 'The surprising discovery has opened up new questions about our understanding of the world...'
  },
  {
    source: { id: 'demo', name: 'Business News' },
    author: 'Business Reporter',
    title: 'Startling Economic Data Surprises Market Analysts',
    description: 'New economic data has surprised market analysts with unexpected trends that could indicate major changes ahead.',
    url: 'https://example.com/economic-surprise',
    urlToImage: 'https://via.placeholder.com/400x200/ffcc00/ffffff?text=Economic+News',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    content: 'The surprising economic indicators have left analysts reconsidering their predictions...'
  }
];

export class NewsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getTopHeadlines(
    category: NewsCategory = 'general',
    country: string = 'us',
    pageSize: number = 50
  ): Promise<NewsResponse> {
    // Check if we're in a browser environment and API key is not set
    if (typeof window !== 'undefined' && (!this.apiKey || this.apiKey.trim() === '')) {
      console.log('Using demo news data - API key not set or CORS limitations in browser');
      return {
        status: 'ok',
        totalResults: DEMO_NEWS_DATA.length,
        articles: DEMO_NEWS_DATA
      };
    }

    try {
      const response = await fetch(
        `${NEWS_API_BASE_URL}/top-headlines?category=${category}&country=${country}&pageSize=${pageSize}&apiKey=${this.apiKey}`
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your NewsAPI key in Settings.');
        }
        if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        }
        throw new Error(`Failed to fetch news: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      
      // If we're in browser and there's a CORS error, return demo data
      if (typeof window !== 'undefined' && error instanceof TypeError) {
        console.log('CORS error detected - using demo news data');
        return {
          status: 'ok',
          totalResults: DEMO_NEWS_DATA.length,
          articles: DEMO_NEWS_DATA
        };
      }
      
      throw error;
    }
  }

  async searchNews(
    query: string,
    sortBy: 'relevancy' | 'popularity' | 'publishedAt' = 'publishedAt',
    pageSize: number = 50
  ): Promise<NewsResponse> {
    // Check if we're in a browser environment and API key is not set
    if (typeof window !== 'undefined' && (!this.apiKey || this.apiKey.trim() === '')) {
      console.log('Using demo news data - API key not set or CORS limitations in browser');
      // Filter demo data based on query
      const filteredArticles = DEMO_NEWS_DATA.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
      );
      return {
        status: 'ok',
        totalResults: filteredArticles.length,
        articles: filteredArticles
      };
    }

    try {
      const response = await fetch(
        `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=${sortBy}&pageSize=${pageSize}&apiKey=${this.apiKey}`
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your NewsAPI key in Settings.');
        }
        if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        }
        throw new Error(`Failed to search news: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching news:', error);
      
      // If we're in browser and there's a CORS error, return demo data
      if (typeof window !== 'undefined' && error instanceof TypeError) {
        console.log('CORS error detected - using demo news data');
        return {
          status: 'ok',
          totalResults: DEMO_NEWS_DATA.length,
          articles: DEMO_NEWS_DATA
        };
      }
      
      throw error;
    }
  }

  async getNewsByCategories(categories: NewsCategory[]): Promise<NewsResponse> {
    // Check if we're in a browser environment and API key is not set
    if (typeof window !== 'undefined' && (!this.apiKey || this.apiKey.trim() === '')) {
      console.log('Using demo news data - API key not set or CORS limitations in browser');
      return {
        status: 'ok',
        totalResults: DEMO_NEWS_DATA.length,
        articles: DEMO_NEWS_DATA
      };
    }

    try {
      const promises = categories.map(category => this.getTopHeadlines(category));
      const responses = await Promise.all(promises);
      
      // Combine all articles from different categories
      const allArticles = responses.reduce((acc, response) => {
        return [...acc, ...response.articles];
      }, [] as any[]);

      // Remove duplicates based on URL
      const uniqueArticles = allArticles.filter((article: any, index: number, self: any[]) =>
        index === self.findIndex((a: any) => a.url === article.url)
      );

      // Sort by published date (newest first)
      uniqueArticles.sort((a: any, b: any) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      return {
        status: 'ok',
        totalResults: uniqueArticles.length,
        articles: uniqueArticles,
      };
    } catch (error) {
      console.error('Error fetching news by categories:', error);
      
      // If we're in browser and there's a CORS error, return demo data
      if (typeof window !== 'undefined' && error instanceof TypeError) {
        console.log('CORS error detected - using demo news data');
        return {
          status: 'ok',
          totalResults: DEMO_NEWS_DATA.length,
          articles: DEMO_NEWS_DATA
        };
      }
      
      throw error;
    }
  }
}