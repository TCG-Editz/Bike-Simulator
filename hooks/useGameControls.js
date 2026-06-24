import { useEffect, useRef } from 'react';

export function useGameControls() {
  const keysRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false,
    brake: false
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          keysRef.current.forward = true;
          break;
        case 's':
        case 'arrowdown':
          keysRef.current.backward = true;
          break;
        case 'a':
        case 'arrowleft':
          keysRef.current.left = true;
          break;
        case 'd':
        case 'arrowright':
          keysRef.current.right = true;
          break;
        case ' ':
          keysRef.current.boost = true;
          break;
        case 'shift':
          keysRef.current.brake = true;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          keysRef.current.forward = false;
          break;
        case 's':
        case 'arrowdown':
          keysRef.current.backward = false;
          break;
        case 'a':
        case 'arrowleft':
          keysRef.current.left = false;
          break;
        case 'd':
        case 'arrowright':
          keysRef.current.right = false;
          break;
        case ' ':
          keysRef.current.boost = false;
          break;
        case 'shift':
          keysRef.current.brake = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('keyup', handleKeyUp, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keysRef;
}