export class SessionResponseDto {
  id: string;
  userAgent: string | null;
  ip_address: string | null;
  device: string | null;
  expires: Date;
}
