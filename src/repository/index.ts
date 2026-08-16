/**
 * Global Repository Instance
 * Singleton repository used throughout the application
 */

import Repository from './Repository';
import MockDataSource from './MockDataSource';

// Initialize repository with mock data source by default
const repository = new Repository(new MockDataSource());

// Export singleton instance
export default repository;
