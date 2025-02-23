```
   ▄████████    ▄█    █▄       ▄████████    ▄████████    ▄████████ ████████▄  
  ███    ███   ███    ███     ███    ███   ███    ███   ███    ███ ███   ▀███ 
  ███    █▀    ███    ███     ███    ███   ███    ███   ███    █▀  ███    ███ 
  ███         ▄███▄▄▄▄███▄▄   ███    ███  ▄███▄▄▄▄██▀  ▄███▄▄▄     ███    ███ 
▀███████████ ▀▀███▀▀▀▀███▀  ▀███████████ ▀▀███▀▀▀▀▀   ▀▀███▀▀▀     ███    ███ 
         ███   ███    ███     ███    ███ ▀███████████   ███    █▄  ███    ███ 
   ▄█    ███   ███    ███     ███    ███   ███    ███   ███    ███ ███   ▄███ 
 ▄████████▀    ███    █▀      ███    █▀    ███    ███   ██████████ ████████▀  
                                           ███    ███                         
```

Source for ASCII-fonts: https://www.coolgenerator.com/ascii-text-generator
(Font: Delta Corps Priest 1


# What is this?
This project includes shared types and classes for the JNI Home Automate project and a script to
push the shared code to the corresponding projects.

# What's the motivation?
Automated code provisioning by avoid a public npm project.

# Dependencies

## Telegram Service
To use `shared/telegram/TelegramMessenger` the control Telegram service must be running and provide
the MQTT topic `jniHome/services/telegramBot/send`.

## Alert Messages
To be able to send alerts the contol Home Briefing service must run and provide a topic
 `jniHome/services/briefing/alert`.


# Update all packages to the latest version

1. Ensure to have 'NPM Check Updates' installed (you might need root priviliges).
```
npm install -g npm-check-updates
```

2. Use `ncu` to check for available updates in the current project.

3. Run `ncu -u` to update to all latest versions in the package file.

4. Run `npm install` to actually update to the latest versions.


# How to use
Edit the shared code in `src/shared`.
Only the "shared" directory and all its subfolders will be pushed.
Existing shared folders in target projects will be completely remooved.
Run the script in `./script/push_shared.sh`
```
    The code you would write
```

# Release History

## v2.1.0 (Untagged)
- Update libs for 2025
- Update linting
- Update testing

## v2.0.0
- Rename "Hue Bridge" to "Halo" #48
- Provice reset strategies for Alive ticker and Telegram MQTT messenger.
- Wait up to 20 minutes for MQTT connection on init.
- Refactor and document initFrame method.
- Enhance error handling on exit and reset.
- Provide a function with a managed call.
- Better error message on startup of MQTT Server Connection #2.
- Add pan topics to shared topics.
- Add ActionSource and Command topics for Hue Bridge.
- Add optional pattern.
- Add enums functions.
- Add JSON Reviver (for Dates)
- Typescript 5.3
- Introduce winston logging.
- Updated dependencies
- Tougher linting rules

## v1.6.2
- Ommit Exceptions on publish and subscribe when exit requested.

## v1.6.1
- Make Aliveticker resilient against exceptions.

## v1.6.0
- Introduce init and reset events to services.

## v1.5.1
- Enhance exception handling when ending MQTT connection.

## v1.5.0
- Provide command alternatives for command registration.

## v1.4.0
- Latest libraries.
- Switch to NextNode.
- Replace npm by pnpm.
- Remove check connection to set MaxListeners.
- Add Davinci Rest Bridge.

## v1.3.0
- Improved error handling and testing for MQTT Helper.
- Learning the state of the current MQTT connection.
- Removed deprecated 'monitor neo sensors' project.

## v1.2.0
- Add CommandRegistrar to periodically register available commands to Telegram bot.
- Set maximum for listeners via MQTT Server connection.

## v1.1.0
- Added git add, commit and push for distributed changes.

## v1.0.0
- Initial commit.
