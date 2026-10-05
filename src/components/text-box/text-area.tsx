"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconSend } from "@tabler/icons-react";
import EmojiSelector from "./emoji-selector";
import { Textarea } from "../ui/textarea";
import AttachmentSelector from "./attachment-slector";
import AttachmentPreview from "./attachment-preview";
import useMessageBoxStore from "./messangingStore";
import useVoiceRecordingStore from "./voice-recorder/voiceRecordingStore";
import { cn } from "@/lib/utils";
import { useAutoScroll } from "./useAutoScroll";
import VoiceRecorder from "./voice-recording";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TextBox = (_props: { chatId?: string; className?: string }) => {
	const { text, setText, sendMessage, attachments } = useMessageBoxStore();
	const { isRecording } = useVoiceRecordingStore();
	const attachmentCount = attachments.length;
	const hasImageAttachment = attachments.some((attachment) =>
		attachment.type?.startsWith("image/"),
	);
	const hasContent = text.trim().length > 0 || attachmentCount > 0;
	const [isFocused, setIsFocused] = useState(false);
	const inputContainerRef = useRef<HTMLDivElement>(null);

	useAutoScroll({
		isFocused,
		isTyping: (text?.length ?? 0) > 0,
		inputContainerRef,
	});

	return (
		<div className="flex flex-col w-full gap-2 px-2">
			<AttachmentPreview />
			<div className="flex items-end w-full gap-3" ref={inputContainerRef}>
				{isRecording ? (
					<VoiceRecorder />
				) : (
					<>
						<div className="flex flex-1 flex-col rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/30 focus-within:border-primary/40 focus-within:shadow-md">
							<div className="flex custom-scrollbar items-end gap-2 px-3 py-2">
								<EmojiSelector
									onSelect={(emoji) => {
										setText(`${text}${emoji}`);
									}}
								/>
								<Textarea
									placeholder={
										hasImageAttachment
											? "Add a caption..."
											: attachmentCount > 0
												? "Add a message..."
												: "Type your message..."
									}
									value={text}
									rows={1}
									onChange={(e) => setText(e.target.value)}
									onFocus={() => setIsFocused(true)}
									onBlur={() => setIsFocused(false)}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey && hasContent) {
											e.preventDefault();
											sendMessage();
										}
									}}
									className="field-sizing-content mb-0.5 hide-scrollbar min-h-0 max-h-32 w-full flex-1 resize-none border-0 bg-transparent py-1 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
								/>
								<AttachmentSelector
									multiple={true}
									maxFiles={5}
									maxFileSize={50}
								/>
							</div>
						</div>
						{hasContent ? (
							<Button
								className={cn(
									"mx-0 h-12 w-12 rounded-full group cursor-pointer transition-all duration-300",
									"shadow-md hover:shadow-lg active:scale-95",
									hasContent
										? "bg-primary hover:bg-primary/90 text-primary-foreground scale-100"
										: "scale-95 opacity-60",
								)}
								variant={hasContent ? "default" : "outline"}
								onClick={sendMessage}
								disabled={!hasContent}
							>
								<IconSend
									className={cn(
										"size-5 transition-all duration-300",
										hasContent
											? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
											: "",
									)}
								/>
							</Button>
						) : (
							<VoiceRecorder />
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default TextBox;
