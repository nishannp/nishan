// src/pages/Home.js
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { MovieCard } from '../components/MovieCard';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin: 40px 0;
  font-size: 2.5rem;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  justify-items: center;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #2c3e50;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #e74c3c;
  background-color: #fadbd8;
  border-radius: 8px;
  margin: 20px auto;
  max-width: 600px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  gap: 10px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background-color: white;
  color: #2c3e50;
  cursor: pointer;

  &:hover {
    border-color: #3498db;
  }
`;

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'movies'));
        const movieList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort movies based on selected option
        const sortedMovies = sortMovies(movieList, sortBy);
        setMovies(sortedMovies);
        setError(null);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [sortBy]);

  const sortMovies = (movieList, sortOption) => {
    switch (sortOption) {
      case 'rating':
        return [...movieList].sort((a, b) => b.rating - a.rating);
      case 'title':
        return [...movieList].sort((a, b) => 
          a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        );
      case 'newest':
        return [...movieList].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      default:
        return movieList;
    }
  };

  if (loading) {
    return (
      <HomeContainer>
         <Helmet>
        <title>Nishan Movie Collection</title>
        <meta name="description" content="Explore my curated collection of movie reviews." />
      </Helmet>
        <Header>Nishan Movie's</Header>
        <LoadingSpinner>Loading movies...</LoadingSpinner>
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <Header>Nishan Movie's</Header>
        <ErrorMessage>{error}</ErrorMessage>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <Header>Nishan Movie's</Header>
      <Controls>
        <Select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="rating">Highest Rated</option>
          <option value="title">Title (A-Z)</option>
        </Select>
      </Controls>
      <MovieGrid>
        {movies.length === 0 ? (
          <p>No movies found. Add some reviews!</p>
        ) : (
          movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        )}
      </MovieGrid>
    </HomeContainer>
  );
};