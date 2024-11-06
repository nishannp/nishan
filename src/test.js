// src/components/MovieCard.js
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  width: 300px;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
  }
`;

const MovieTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #2c3e50;
`;

const Rating = styled.div`
  color: #f1c40f;
  display: flex;
  align-items: center;
  margin: 10px 0;
  gap: 5px;
`;

const Review = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReadMore = styled.span`
  color: #3498db;
  margin-top: 8px;
  display: block;
  font-size: 0.9rem;
`;

export const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/review/${movie.id}`);
  };

  return (
    <Card onClick={handleClick}>
      <MovieTitle>{movie.title}</MovieTitle>
      <Rating>
        {[...Array(movie.rating)].map((_, i) => (
          <FaStar key={i} />
        ))}
      </Rating>
      <Review>{movie.review}</Review>
      <ReadMore>Read full review →</ReadMore>
    </Card>
  );
};

// src/pages/ReviewPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import styled from 'styled-components';
import { FaStar, FaArrowLeft } from 'react-icons/fa';

const ReviewContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 20px;
  
  &:hover {
    color: #2980b9;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const Rating = styled.div`
  color: #f1c40f;
  display: flex;
  align-items: center;
  margin: 20px 0;
  gap: 5px;
  font-size: 1.5rem;
`;

const Review = styled.p`
  color: #2c3e50;
  line-height: 1.8;
  font-size: 1.1rem;
  white-space: pre-wrap;
`;

export const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const docRef = doc(db, 'movies', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setMovie({ id: docSnap.id, ...docSnap.data() });
      } else {
        navigate('/');
      }
    };

    fetchMovie();
  }, [id, navigate]);

  if (!movie) {
    return <ReviewContainer>Loading...</ReviewContainer>;
  }

  return (
    <ReviewContainer>
      <BackButton onClick={() => navigate('/')}>
        <FaArrowLeft /> Back to Movies
      </BackButton>
      <Title>{movie.title}</Title>
      <Rating>
        {[...Array(movie.rating)].map((_, i) => (
          <FaStar key={i} />
        ))}
      </Rating>
      <Review>{movie.review}</Review>
    </ReviewContainer>
  );
};