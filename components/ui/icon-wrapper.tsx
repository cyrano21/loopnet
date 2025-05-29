import React from 'react';
import { IconType } from 'react-icons';

interface IconWrapperProps {
  icon: IconType;
  className?: string;
  size?: string | number;
  color?: string;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ 
  icon: Icon, 
  className, 
  size, 
  color 
}) => {
  return React.createElement(Icon as React.ComponentType<any>, {
    className,
    size,
    color,
  });
};

// Wrapper spécifique pour éviter les conflits de types
export const createIconComponent = (Icon: IconType) => {
  const WrappedIcon: React.FC<{ className?: string; size?: string | number; color?: string }> = (props) => {
    return React.createElement(Icon, props);
  };
  return WrappedIcon;
};
