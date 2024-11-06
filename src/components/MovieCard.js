// src/components/MovieCard.js
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaStar, FaLongArrowAltRight } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 20px;
  width: 340px;
  padding: 25px;
  cursor: pointer;
  position: relative;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${fadeIn} 0.5s ease-out;
  border: 1px solid #f0f0f0;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    border-color: transparent;

    .arrow-icon {
      transform: translateX(6px);
      opacity: 1;
    }
  }
`;

const MovieTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 15px;
  line-height: 1.3;
  letter-spacing: -0.02em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RatingContainer = styled.div`
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Star = styled(FaStar)`
  color: #FF9F1C;
  font-size: 18px;
`;

const EmptyStar = styled(FaStar)`
  color: #E5E5E5;
  font-size: 18px;
`;

const RatingText = styled.span`
  color: #666;
  font-size: 15px;
  margin-left: 10px;
  font-weight: 500;
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(to right, #f0f0f0 0%, transparent 100%);
  margin: 20px 0;
`;

const Review = styled.p`
  color: #4a4a4a;
  line-height: 1.7;
  font-size: 1.05rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 20px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const ReadMore = styled.div`
  color: #2D3436;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;

  .arrow-icon {
    transition: all 0.3s ease;
    opacity: 0.7;
  }
`;

const ReviewDate = styled.div`
  color: #95A5A6;
  font-size: 0.9rem;
  font-weight: 500;
`;

export const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/review/${movie.id}`);
  };

  // Format date (assuming movie has a createdAt field)
  const formattedDate = movie.createdAt 
    ? new Date(movie.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  return (
    <Card onClick={handleClick}>
      <MovieTitle>{movie.title}</MovieTitle>
      
      <RatingContainer>
        {[...Array(5)].map((_, index) => (
          index < movie.rating ? (
            <Star key={index} />
          ) : (
            <EmptyStar key={index} />
          )
        ))}
        <RatingText>{movie.rating} out of 5</RatingText>
      </RatingContainer>

      <Divider />
      
      <Review>{movie.review}</Review>
      
      <Footer>
        <ReadMore>
          Read Review <FaLongArrowAltRight className="arrow-icon" />
        </ReadMore>
        <ReviewDate>{formattedDate}</ReviewDate>
      </Footer>
    </Card>
  );
};