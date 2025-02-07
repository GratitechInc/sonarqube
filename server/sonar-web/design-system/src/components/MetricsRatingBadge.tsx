/*
 * SonarQube
 * Copyright (C) 2009-2023 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import styled from '@emotion/styled';
import tw from 'twin.macro';
import { getProp, themeColor, themeContrast } from '../helpers/theme';
import { MetricsLabel } from '../types/measures';

interface Props extends React.AriaAttributes {
  className?: string;
  label: string;
  rating?: MetricsLabel;
  size?: 'xs' | 'sm' | 'md';
}

const SIZE_MAPPING = {
  xs: '1rem',
  sm: '1.5rem',
  md: '2rem',
};

export function MetricsRatingBadge({ className, size = 'sm', label, rating, ...ariaAttrs }: Props) {
  if (!rating) {
    return (
      <span aria-label={label} className={className} {...ariaAttrs}>
        –
      </span>
    );
  }
  return (
    <MetricsRatingBadgeStyled
      aria-label={label}
      className={className}
      rating={rating}
      size={SIZE_MAPPING[size]}
      {...ariaAttrs}
    >
      {rating}
    </MetricsRatingBadgeStyled>
  );
}

const MetricsRatingBadgeStyled = styled.div<{ rating: MetricsLabel; size: string }>`
  width: ${getProp('size')};
  height: ${getProp('size')};
  color: ${({ rating }) => themeContrast(`rating.${rating}`)};
  font-size: ${({ size }) => (size === '2rem' ? '0.875rem' : '0.75rem')};
  background-color: ${({ rating }) => themeColor(`rating.${rating}`)};

  ${tw`sw-inline-flex sw-items-center sw-justify-center`};
  ${tw`sw-rounded-pill`};
  ${tw`sw-font-semibold`};
`;
