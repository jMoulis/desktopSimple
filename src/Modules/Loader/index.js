import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const Loader = ({ size }) => (
  <div className="loader">
    <svg
      width={`${size}px`}
      height={`${size}px`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className="lds-wedges"
      style={{
        animationPlayState: 'running',
        animationDelay: '0s',
        background: 'none',
      }}
    >
      <g
        transform="translate(50,50)"
        style={{
          animationPlayState: 'running',
          animationDelay: '0s',
        }}
      >
        <g
          ng-attr-transform="scale({{config.scale}})"
          transform="scale(0.7)"
          style={{
            animationPlayState: 'running',
            animationDelay: '0s',
          }}
        >
          <g
            transform="translate(-50,-50)"
            style={{
              animationPlayState: 'running',
              animationDelay: '0s',
            }}
          >
            <g
              transform="rotate(282 50 50)"
              style={{
                animationPlayState: 'running',
                animationDelay: '0s',
                }}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="linear"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
                dur="1s"
                begin="0s"
                repeatCount="indefinite"
                style={{
                  animationPlayState: 'running',
                  animationDelay: '0s',
                }}
              />
              <path
                ng-attr-fill-opacity="{{config.opacity}}"
                ng-attr-fill="{{config.c1}}"
                d="M50 50L50 0A50 50 0 0 1 100 50Z"
                fillOpacity="0.8"
                fill="#ca1e32"
                style={{
                  animationPlayState: 'running',
                  animationDelay: '0s',
                }}
              />
            </g>
            <g
              transform="rotate(211.5 50 50)"
              style={{
                animationPlayState: 'running',
                animationDelay: '0s',
              }}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="linear"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
                dur="1.3333333333333333s"
                begin="0s"
                repeatCount="indefinite"
                style={{
                  animationPlayState: 'running',
                  animationDelay: '0s',
                }}
              />
              <path
                ng-attr-fill-opacity="{{config.opacity}}"
                ng-attr-fill="{{config.c2}}"
                d="M50 50L50 0A50 50 0 0 1 100 50Z"
                transform="rotate(90 50 50)"
                fillOpacity="0.8"
                fill="#eb7e24"
                style={{
                  animationPlayState: 'running',
                  animationDelay: '0s',
                }}
              />
            </g>
            <g
              transform="rotate(141 50 50)"
              style={{
                animationPlayState: 'running',
                animationDelay: '0s',
              }}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="linear"
                alues="0 50 50;360 50 50"
                keyTimes="0;1"
                dur="2s"
                begin="0s"
                repeatCount="indefinite"
                style={{
                  animationPlayState: 'running',
                  animationDelay: '0s',
                }}
              />
              <path
                ng-attr-fill-opacity="{{config.opacity}}"
                ng-attr-fill="{{config.c3}}"
                d="M50 50L50 0A50 50 0 0 1 100 50Z"
                transform="rotate(180 50 50)"
                fillOpacity="0.8"
                fill="#c0c4c9"
                style={{
                  animationPlayState: 'running',
                  animationDelay: '0s',
                }}
              />
            </g>
            <g
              transform="rotate(70.5 50 50)"
              style={{
                animationPlayState: 'running',
                animationDelay: '0s',
              }}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                calcMode="linear"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
                dur="4s"
                begin="0s"
                repeatCount="indefinite"
                style={{
                  animationPlayState: 'running',
                  animationDelay: '0s',
                }}
              />
              <path
                ng-attr-fill-opacity="{{config.opacity}}"
                ng-attr-fill="{{config.c4}}"
                d="M50 50L50 0A50 50 0 0 1 100 50Z"
                transform="rotate(270 50 50)"
                fillOpacity="0.8"
                fill="#5c8c9c"
                style={{
                  animationPlayState: 'running',
                  animationDelay: '0s',
                }}
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  </div>
);

Loader.propTypes = {
  size: PropTypes.number,
};

Loader.defaultProps = {
  size: 200,
};

export default Loader;
