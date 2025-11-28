'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AnimatedWrapper.tsx
import { motion } from 'framer-motion';
import React from 'react';

export enum AnimationType {
  Fade = 'fade',
  Scale = 'scale',
  SlideLeft = 'slideLeft',
  SlideRight = 'slideRight',
  SlideUp = 'slideUp',
  SlideDown = 'slideDown',
  Rotate = 'rotate',
  Bounce = 'bounce',
  Flip = 'flip',
  FadeScale = 'fadeScale',
  Rotate3d = 'rotate3d',
  OpacitySlide = 'opacitySlide',
}

interface AnimatedWrapperProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  animationType?: AnimationType;
  className?: string;
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  duration = 0.5,
  delay = 0,
  animationType = AnimationType.Fade,
  className = '',
}) => {
  const animationVariants: Record<AnimationType, { hidden: any; visible: any }> = {
    [AnimationType.Fade]: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    [AnimationType.Scale]: {
      hidden: { scale: 0 },
      visible: { scale: 1 },
    },
    [AnimationType.SlideLeft]: {
      hidden: { x: '-100%' },
      visible: { x: '0%' },
    },
    [AnimationType.SlideRight]: {
      hidden: { x: '100%' },
      visible: { x: '0%' },
    },
    [AnimationType.SlideUp]: {
      hidden: { y: '100%' },
      visible: { y: '0%' },
    },
    [AnimationType.SlideDown]: {
      hidden: { y: '-100%' },
      visible: { y: '0%' },
    },
    [AnimationType.Rotate]: {
      hidden: { rotate: -90 },
      visible: { rotate: 0 },
    },
    [AnimationType.Bounce]: {
      hidden: { y: '-50%' },
      visible: { y: '0%' },
    },
    [AnimationType.Flip]: {
      hidden: { rotateY: -180 },
      visible: { rotateY: 0 },
    },
    [AnimationType.FadeScale]: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
    },
    [AnimationType.Rotate3d]: {
      hidden: { rotateX: 90 },
      visible: { rotateX: 0 },
    },
    [AnimationType.OpacitySlide]: {
      hidden: { opacity: 0, x: '-50%' },
      visible: { opacity: 1, x: '0%' },
    },
  };

  // Si por alguna razón se pasa un animationType no definido, se usa Fade.
  const selectedVariant = animationVariants[animationType] || animationVariants[AnimationType.Fade];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={selectedVariant}
      transition={{ duration, delay }}
      className={className}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedWrapper;
