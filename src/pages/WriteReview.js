import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // import Link for navigation

const HomeButton = styled(Link)`
  position: fixed;
  top: 20px;
  left: 20px;
  background: #2c3e50;
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 0.2s;
  z-index: 10;

  &:hover {
    background: #34495e;
  }
`;

const WriteContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
`;

const Form = styled.form`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  height: 150px;
  font-size: 1rem;
  resize: vertical;
`;

const Button = styled.button`
  background: #2c3e50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;

  &:hover {
    background: #34495e;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.filled ? '#f1c40f' : '#ddd'};
  font-size: 1.5rem;
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-size: 1.2rem;
`;

export const WriteReview = () => {
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Show "Submitting..." popup
    try {
      await addDoc(collection(db, 'movies'), {
        title,
        review,
        rating,
        timestamp: new Date().toISOString()
      });
      setTitle('');
      setReview('');
      setRating(0);
      setIsSubmitting(false);
      setIsSuccess(true); // Show "Success!" popup
      setTimeout(() => setIsSuccess(false), 2000); // Hide after 2 seconds
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Error adding review');
      setIsSubmitting(false);
    }
  };

  return (
    <WriteContainer>
      <HomeButton to="/">Home</HomeButton> {/* Home Button */}
      
      <Form onSubmit={handleSubmit}>
        <h2>Write a Review</h2>
        <Input
          type="text"
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <RatingContainer>
          {[...Array(5)].map((_, index) => (
            <StarButton
              key={index}
              type="button"
              filled={index < rating}
              onClick={() => setRating(index + 1)}
            >
              <FaStar />
            </StarButton>
          ))}
        </RatingContainer>
        <TextArea
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
        <Button type="submit">Add Review</Button>
      </Form>

      {/* Submitting popup */}
      {isSubmitting && <Popup>Submitting...</Popup>}
      
      {/* Success popup */}
      {isSuccess && <Popup>Review added successfully!</Popup>}
    </WriteContainer>
  );
};
