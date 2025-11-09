"use client";

export default function MapSection() {
	return (
		<div className="w-full flex justify-center mt-10">
			<div className="w-full max-w-[1300px] px-4">
				<div className="overflow-hidden rounded-3xl border-[3px] border-[#2B70E4] shadow-lg w-full h-[350px] sm:h-[420px]">
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.8114865879807!2d-57.607496623131276!3d-38.004857344985126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584d8d3858bf149%3A0x9ba4bfe75070743!2sAv.%20Victorio%20Tetamanti%20867%2C%20B7611CAU%20Mar%20del%20Plata%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1762714675006!5m2!1ses!2sar"
						width="100%"
						height="100%"
						style={{ border: 0 }}
						allowFullScreen
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"></iframe>
				</div>
			</div>
		</div>
	);
}
