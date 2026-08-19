import React from 'react';
import { TravelBuddiesHub } from './travel-buddies/TravelBuddiesHub';

interface FeedViewProps {
  onSelectDestinationByName: (name: string) => void;
  onNavigateToProfile?: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  onSelectDestinationByName,
  onNavigateToProfile,
}) => {
  return (
    <TravelBuddiesHub
      onSelectDestinationByName={onSelectDestinationByName}
      onNavigateToProfile={onNavigateToProfile}
    />
  );
};
