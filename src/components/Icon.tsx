import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps extends LucideIcons.LucideProps {
  name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) return null;
  return <LucideIcon {...props} />;
};

export default Icon;
