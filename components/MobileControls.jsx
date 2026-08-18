import React, { useEffect, useRef } from 'react';
import styles from '../styles/MobileControls.module.css';

const MobileControls = () => {
  const activeKeys = useRef(new Set());

  const pressKey = (key) => {
    if (activeKeys.current.has(key)) return;

    activeKeys.current.add(key);

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key,
        bubbles: true
      })
    );
  };

  const releaseKey = (key) => {
    if (!activeKeys.current.has(key)) return;

    activeKeys.current.delete(key);

    window.dispatchEvent(
      new KeyboardEvent('keyup', {
        key,
        bubbles: true
      })
    );
  };

  useEffect(() => {
    return () => {
      activeKeys.current.forEach((key) => {
        window.dispatchEvent(
          new KeyboardEvent('keyup', {
            key,
            bubbles: true
          })
        );
      });

      activeKeys.current.clear();
    };
  }, []);

  const buttonProps = (key) => ({
    onPointerDown: (e) => {
      e.preventDefault();

      e.currentTarget.setPointerCapture?.(
        e.pointerId
      );

      pressKey(key);
    },

    onPointerUp: (e) => {
      e.preventDefault();
      releaseKey(key);
    },

    onPointerCancel: (e) => {
      e.preventDefault();
      releaseKey(key);
    },

    onPointerLeave: (e) => {
      if (e.buttons === 0) {
        releaseKey(key);
      }
    }
  });

  return (
    <div className={styles.mobileControls}>

      <button
        type="button"
        className={`${styles.controlButton} ${styles.leftButton}`}
        {...buttonProps('ArrowLeft')}
      >
        <strong>◀</strong>
        <span>LEFT</span>
      </button>

      <button
        type="button"
        className={`${styles.controlButton} ${styles.accelerateButton}`}
        {...buttonProps('w')}
      >
        <strong>▲</strong>
        <span>ACCEL</span>
      </button>

      <button
        type="button"
        className={`${styles.controlButton} ${styles.rightButton}`}
        {...buttonProps('ArrowRight')}
      >
        <strong>▶</strong>
        <span>RIGHT</span>
      </button>

    </div>
  );
};

export default MobileControls;
