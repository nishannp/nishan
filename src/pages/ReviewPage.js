// src/pages/ReviewPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import styled, { keyframes } from 'styled-components';
import { FaStar, FaArrowLeft, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 40px 20px;
`;

const ReviewContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #5a67d8;
  cursor: pointer;
  font-size: 1rem;
  margin: 20px;
  padding: 10px 16px;
  border-radius: 30px;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: rgba(90, 103, 216, 0.1);
    transform: translateX(-5px);
  }
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  color: white;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%);
    pointer-events: none;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  line-height: 1.2;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const Star = styled(FaStar)`
  color: #ffd700;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  font-size: 1.8rem;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ContentSection = styled.div`
  padding: 40px;
  background: white;
`;

const Review = styled.p`
  color: #4a5568;
  line-height: 1.9;
  font-size: 1.2rem;
  white-space: pre-wrap;
  margin-bottom: 30px;
  letter-spacing: 0.3px;

  &::first-letter {
    font-size: 3rem;
    font-weight: 500;
    color: #667eea;
    float: left;
    margin-right: 12px;
    line-height: 1;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  font-size: 1.2rem;
  color: #4a5568;
`;

const LoadingSpinner = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: ${LoadingSpinner} 1s linear infinite;
  margin-right: 12px;
`;

export const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const docRef = doc(db, 'movies', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setMovie({ id: docSnap.id, ...docSnap.data() });
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, navigate]);

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        Loading review...
      </LoadingContainer>
    );
  }

  if (!movie) {
    return null;
  }

  // Format the date (assuming movie has a createdAt field)
  const reviewDate = movie.timestamp ? new Date(movie.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Date not available';

  // Calculate reading time (rough estimate)
  const readingTime = Math.max(1, Math.ceil(movie.review.split(' ').length / 200));

  return (
    <PageWrapper>
      <ReviewContainer>
      <Helmet>
        <title>{movie.title} - Nishan Movie Review</title>
        <meta name="description" content={`Read the full review for ${movie.title}.`} />
      </Helmet>
     
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Movies
        </BackButton>
        
        <HeaderSection>
          <Title>{movie.title}</Title>
          <Rating>
            <StarContainer>
              {[...Array(movie.rating)].map((_, i) => (
                <Star key={i} />
              ))}
            </StarContainer>
            <span style={{ marginLeft: '10px', fontSize: '1.1rem' }}>
              {movie.rating}/5
            </span>
          </Rating>
          
          <MetaInfo>
            <MetaItem>
              <FaCalendarAlt /> {reviewDate}
            </MetaItem>
            <MetaItem>
              <FaClock /> {readingTime} min read
            </MetaItem>
          </MetaInfo>
        </HeaderSection>

        <ContentSection>
          <Review>{movie.review}</Review>
        </ContentSection>
      </ReviewContainer>
    </PageWrapper>
  );
};