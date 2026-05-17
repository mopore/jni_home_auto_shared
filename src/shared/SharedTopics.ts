export const sharedTopics = {
	MATRIX_SEND : "jniHome/services/matrixBot/send" as const,
	BRIEFING_ALERT: "jniHome/services/briefing/alert" as const,
	HALO_SYSTEM_COMMAND: "jniHome/services/halo/command" as const,
	HALO_USER_COMMAND: "jniHome/services/halo/commandUser" as const,
	HALO_MOVE_HISTORY: "jniHome/services/halo/moveHistory" as const,
	PAN_CHECK_RESULTS: "pan/check" as const,
	PAN_UPCOMING_EVENTS: "pan/upcomingEvents" as const,
}
