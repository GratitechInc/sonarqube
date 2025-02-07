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
import { debounce } from 'lodash';
import React from 'react';
import {
  ActionMeta,
  GroupBase,
  InputActionMeta,
  OnChangeValue,
  OptionsOrGroups,
} from 'react-select';
import { AsyncProps } from 'react-select/async';
import Select from 'react-select/dist/declarations/src/Select';
import tw from 'twin.macro';
import { DEBOUNCE_DELAY, themeBorder } from '../helpers';
import { DropdownToggler } from './DropdownToggler';
import { IconOption, LabelValueSelectOption, SelectProps } from './InputSelect';
import { SearchHighlighterContext } from './SearchHighlighter';
import { SearchSelect } from './SearchSelect';
import { SearchSelectDropdownControl } from './SearchSelectDropdownControl';

declare module 'react-select/dist/declarations/src/Select' {
  export interface Props<Option, IsMulti extends boolean, Group extends GroupBase<Option>> {
    clearIconLabel?: string;
    minLength?: number;
    tooShortText?: string;
  }
}

export interface SearchSelectDropdownProps<
  V,
  Option extends LabelValueSelectOption<V>,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends SelectProps<V, Option, IsMulti, Group>,
    AsyncProps<Option, IsMulti, Group> {
  controlAriaLabel?: string;
  controlLabel?: React.ReactNode | string;
  isDiscreet?: boolean;
}

export function SearchSelectDropdown<
  V,
  Option extends LabelValueSelectOption<V>,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: SearchSelectDropdownProps<V, Option, IsMulti, Group>) {
  const {
    isDiscreet,
    value,
    loadOptions,
    controlLabel,
    isDisabled,
    minLength,
    controlAriaLabel,
    ...rest
  } = props;
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const ref = React.useRef<Select<Option, IsMulti, Group>>(null);

  const toggleDropdown = React.useCallback(
    (value?: boolean) => {
      setOpen(value === undefined ? !open : value);
    },
    [open]
  );

  const handleChange = React.useCallback(
    (newValue: OnChangeValue<Option, IsMulti>, actionMeta: ActionMeta<Option>) => {
      toggleDropdown(false);
      props.onChange?.(newValue, actionMeta);
    },
    [toggleDropdown, props.onChange]
  );

  const handleLoadOptions = React.useCallback(
    (query: string, callback: (options: OptionsOrGroups<Option, Group>) => void) => {
      return query.length >= (minLength ?? 0) ? loadOptions?.(query, callback) : undefined;
    },
    [minLength, loadOptions]
  );
  const debouncedLoadOptions = React.useRef(debounce(handleLoadOptions, DEBOUNCE_DELAY));

  const handleInputChange = React.useCallback(
    (newValue: string, actionMeta: InputActionMeta) => {
      const value = actionMeta.action === 'menu-close' ? actionMeta.prevInputValue : newValue;
      setInputValue(value);
      props.onInputChange?.(value, actionMeta);
    },
    [props.onInputChange]
  );

  React.useEffect(() => {
    if (open) {
      ref.current?.inputRef?.select();
    } else {
      setInputValue('');
    }
  }, [open]);

  return (
    <DropdownToggler
      allowResizing
      className="sw-overflow-visible sw-border-none"
      isPortal
      onRequestClose={() => {
        toggleDropdown(false);
      }}
      open={open}
      overlay={
        <SearchHighlighterContext.Provider value={inputValue}>
          <StyledSearchSelectWrapper>
            <SearchSelect
              cacheOptions
              {...rest}
              components={{
                SingleValue: () => null,
                Option: IconOption,
                ...rest.components,
              }}
              inputValue={inputValue}
              loadOptions={debouncedLoadOptions.current}
              menuIsOpen
              minLength={minLength}
              onChange={handleChange}
              onInputChange={handleInputChange}
              selectRef={ref}
            />
          </StyledSearchSelectWrapper>
        </SearchHighlighterContext.Provider>
      }
    >
      <SearchSelectDropdownControl
        ariaLabel={controlAriaLabel}
        disabled={isDisabled}
        isDiscreet={isDiscreet}
        label={controlLabel}
        onClick={() => {
          toggleDropdown(true);
        }}
      />
    </DropdownToggler>
  );
}

const StyledSearchSelectWrapper = styled.div`
  ${tw`sw-w-full`};
  ${tw`sw-rounded-2`};

  .react-select {
    border: ${themeBorder('default', 'inputDisabledBorder')};
    ${tw`sw-rounded-2`};
  }

  .react-select__menu {
    ${tw`sw-m-0`};
    ${tw`sw-relative`};
    ${tw`sw-shadow-none`};
    ${tw`sw-rounded-2`};
  }

  .react-select__menu-notice--loading {
    ${tw`sw-hidden`}
  }

  .react-select__input-container {
    &::after {
      content: '' !important;
    }
  }
`;
