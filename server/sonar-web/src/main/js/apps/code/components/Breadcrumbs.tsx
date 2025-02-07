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
import * as React from 'react';
import { BranchLike } from '../../../types/branch-like';
import { Breadcrumb, ComponentMeasure } from '../../../types/types';
import ComponentName from './ComponentName';

interface Props {
  branchLike?: BranchLike;
  breadcrumbs: Breadcrumb[];
  rootComponent: ComponentMeasure;
}

export default function Breadcrumbs({ branchLike, breadcrumbs, rootComponent }: Props) {
  return (
    <ul className="code-breadcrumbs">
      {breadcrumbs.map((component, index) => (
        <li key={component.key}>
          <ComponentName
            branchLike={branchLike}
            canBrowse={index < breadcrumbs.length - 1}
            component={component}
            rootComponent={rootComponent}
            unclickable
          />
        </li>
      ))}
    </ul>
  );
}
