import React from 'react';
import { TravelBuddiesFeed } from './travel-buddies/TravelBuddiesFeed';

interface FeedViewProps {
  onSelectDestinationByName: (name: string) => void;
  onNavigateToProfile?: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  onSelectDestinationByName,
  onNavigateToProfile,
}) => {
  return (
    <TravelBuddiesFeed
      onSelectDestinationByName={onSelectDestinationByName}
      onNavigateToProfile={onNavigateToProfile}
    />
  );
};
