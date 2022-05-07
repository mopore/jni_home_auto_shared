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

## v1.0.0
- Initial commit.