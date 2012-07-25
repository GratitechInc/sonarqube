/*
 * Sonar, open source software quality management tool.
 * Copyright (C) 2008-2012 SonarSource
 * mailto:contact AT sonarsource DOT com
 *
 * Sonar is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * Sonar is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with Sonar; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package org.sonar.api.utils.command;

import com.google.common.base.Joiner;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.SystemUtils;

import java.io.File;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * @since 2.7
 */
public class Command {

  private String executable;
  private List<String> arguments = Lists.newArrayList();
  private File directory;
  private Map<String, String> env = Maps.newHashMap(System.getenv());
  private boolean newShell = false;

  private Command(String executable) {
    this.executable = executable;
  }

  public String getExecutable() {
    return executable;
  }

  public List<String> getArguments() {
    return Collections.unmodifiableList(arguments);
  }

  public Command addArgument(String arg) {
    arguments.add(arg);
    return this;
  }

  public Command addArguments(List<String> args) {
    arguments.addAll(args);
    return this;
  }

  public Command addArguments(String[] args) {
    arguments.addAll(Arrays.asList(args));
    return this;
  }

  public File getDirectory() {
    return directory;
  }

  /**
   * Sets working directory.
   */
  public Command setDirectory(File d) {
    this.directory = d;
    return this;
  }

  /**
   * @see {@link org.sonar.api.utils.command.Command#getEnvironmentVariables()}
   * @since 3.2
   */
  public Command setEnvironmentVariable(String name, String value) {
    this.env.put(name, value);
    return this;
  }

  /**
   * Environment variables that are propagated during command execution.
   * The initial value is a copy of the environment of the current process.
   *
   * @return a non-null and immutable map of variables
   * @since 3.2
   */
  public Map<String, String> getEnvironmentVariables() {
    return Collections.unmodifiableMap(env);
  }

  /**
   * @since 3.3
   */
  public boolean isNewShell() {
    return newShell;
  }

  /**
   * Set to true if the script to execute has not enough rights (+x on unix).
   * @since 3.3
   */
  public Command setNewShell(boolean b) {
    this.newShell = b;
    return this;
  }

  String[] toStrings() {
    List<String> command = Lists.newArrayList();
    if (newShell) {
      if (SystemUtils.IS_OS_WINDOWS) {
        command.add("cmd");
        command.add("/C");
      } else {
        command.add("sh");
      }
    }
    command.add(executable);
    command.addAll(arguments);
    return command.toArray(new String[command.size()]);
  }

  public String toCommandLine() {
    return Joiner.on(" ").join(toStrings());
  }

  @Override
  public String toString() {
    return toCommandLine();
  }

  /**
   * Create a command line without any arguments
   *
   * @param executable
   */
  public static Command create(String executable) {
    if (StringUtils.isBlank(executable)) {
      throw new IllegalArgumentException("Command executable can not be blank");
    }
    return new Command(executable);
  }
}
