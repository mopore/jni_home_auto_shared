#!/bin/bash
set -euo pipefail

# Switch to base of jni-home-automate-shared
cd ..
# Save path to automate directory
home=$(pwd)

# start_dir=$(pwd)
# Switch up to base repos directory
cd ..


# Put this Script into the scripts folder of an JNI Home Automate project to fetch shared types and
# classes.

echo "Pushing shared types and classes to repos..."

# Add addiontional Repos in the following array decleration if necessary
repos=( \
	"jni_home_auto_control_halo"\
	"jni_home_auto_control_home_events"\
	"jni_home_auto_control_telegram_bot"\
	"jni_home_auto_monitor_iphone"\
	"jni_home_auto_monitor_services"\
	"jni_home_auto_control_aws_polly"\
	"jni_home_auto_control_briefing"\
)

for repo in "${repos[@]}" 
do
	echo "Updating: $repo"

	if [ -d "./$repo" ]; then
		cd "$repo"
	else
		echo "Repo '${repo}' does not exist and will be cloned."
		git clone "git@github.com:mopore/${repo}.git"
		cd "$repo"
	fi

	rm -rf "src/shared"
	cp -r "$home/src/shared" "src"
	git add src/shared
	if git commit -m "Update on shared types and classes." ; then
		git push
	fi

	# Switch up to base repos directory
	cd ..
	echo "$repo updated."
done

echo "All done."

exit 0
