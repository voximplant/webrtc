/**
 * The RTCConfiguration defines a set of parameters to configure
 * how the peer to peer communication established via
 * RTCPeerConnection is established or re-established.
 */
interface RTCConfiguration {
    /**
     * An array of objects describing servers available to be used by ICE,
     * such as STUN and TURN server.
     */
    iceServers?: RTCIceServer[];
    /**
     * Indicates which candidates the ICE agent is allowed to use.
     */
    iceTransportPolicy?: RTCIceTransportPolicy
    /**
     * Indicates which media-bundling policy to
     * use when gathering ICE candidates.
     */
    bundlePolicy?: RTCBundlePolicy
    /**
     * Indicates which rtcp-mux policy to use when gathering ICE candidates.
     */
    rtcpMuxPolicy?: RTCRtcpMuxPolicy
    /**
     * Sets the target peer identity for the RTCPeerConnection.
     * The RTCPeerConnection will not establish a connection to a remote peer
     * unless it can be successfully authenticated with the provided name.
     */
    peerIdentity?: string;
    /**
     * A set of certificates that the RTCPeerConnection uses to authenticate.
     *
     * Valid values for this parameter are created through calls to the
     * generateCertificate function.
     *
     * Although any given DTLS connection will use only one certificate, this
     * attribute allows the caller to provide multiple certificates that support
     * different algorithms. The final certificate will be selected based on the
     * DTLS handshake, which establishes which certificates are allowed.
     * The RTCPeerConnection implementation selects which of the certificates is
     * used for a given connection; how certificates are selected is outside the
     * scope of this specification.
     *
     * If this value is absent, then a set of certificates are generated for each
     * RTCPeerConnection instance.
     *
     * This option allows applications to establish key continuity.
     * An RTCCertificate can be persisted in [INDEXEDDB] and reused.
     * Persistence and reuse also avoids the cost of key generation.
     *
     * The value for this configuration option cannot change after its value is
     * initially selected. Attempts to change this value must be rejected.
     */
    certificates?: RTCCertificate[]
    /**
     * Size of the prefetched ICE pool as defined in [RTCWEB-JSEP]
     * Section 3.4.4 and 4.1.1.
     */
    iceCandidatePoolSize?: number;
}

enum RTCIceCredentialType {
    /**
     * The credential is a long-term authentication password,
     * as described in [RFC5389], Section 10.2.
     */
    "password",
    /**
     * The credential is an access token, as described in
     * [TRAM-TURN-THIRD-PARTY-AUTHZ], Section 6.2.
     */
    "token"
};

/**
 * The RTCIceServer dictionary is used to describe the STUN and TURN servers
 * that can be used by the ICE agent to establish a connection with a peer.
 */
interface RTCIceServer {
    /**
     * STUN or TURN URI(s) as defined in [RFC7064] and [RFC7065] or other URI types.
     */
    urls: string | string[];
    /**
     * If this RTCIceServer object represents a TURN server, then this attribute
     * specifies the username to use with that TURN server.
     */
    username?: string;
    /**
     * If this RTCIceServer object represents a TURN server, then this attribute
     * specifies the credential to use with that TURN server.
     */
    credential?: string;
    /**
     * If this RTCIceServer object represents a TURN server, then this attribute
     * specifies how credential should be used when that TURN server requests
     * authorization.
     */
    credentialType?: RTCIceCredentialType;
};

enum RTCIceTransportPolicy {
    /**
     * The ICE agent must not send or receive any packets at this point.
     */
    "none",
    /**
     * The ICE agent must only use media relay candidates such as candidates
     * passing through a TURN server. This can be used to reduce leakage of IP
     * addresses in certain use cases.
     */
    "relay",
    /**
     * The ICE agent may use any type of candidates when this value is specified.
     */
    "all"
};


/**
 * Defined in [RTCWEB-JSEP]. The following is a non-normative summary
 * for convenience.
 *
 * The BundlePolicy affects which media tracks are negotiated if the remote
 * endpoint is not BUNDLE-aware, and what ICE candidates are gathered.
 * If the remote endpoint is BUNDLE-aware, all media tracks and data channels
 * are BUNDLEd onto the same transport.
 */
enum RTCBundlePolicy {
    /**
     * Gather ICE candidates for each media type in use (audio, video, and data).
     * If the remote endpoint is not BUNDLE-aware, negotiate only one audio and
     * video track on separate transports.
     */
    "balanced",
    /**
     * Gather ICE candidates for each track. If the remote endpoint is not
     * BUNDLE-aware, negotiate all media tracks on separate transports.
     */
    "max-compat",
    /**
     * Gather ICE candidates for only one track. If the remote endpoint is not
     * BUNDLE-aware, negotiate only one media track.
     */
    "max-bundle"
};

/**
 * Defined in [RTCWEB-JSEP]. The following is a non-normative summary
 * for convenience.
 *
 * The RtcpMuxPolicy affects what ICE candidates are gathered to support
 * non-multiplexed RTCP.
 */
enum RTCRtcpMuxPolicy {
    /**
     * Gather ICE candidates for both RTP and RTCP candidates.
     * If the remote-endpoint is capable of multiplexing RTCP, multiplex RTCP
     * on the RTP candidates. If it is not, use both the RTP and RTCP
     * candidates separately.
     */
    "negotiate",
    /**
     * Gather ICE candidates only for RTP and multiplex RTCP on the RTP candidates.
     * If the remote endpoint is not capable of rtcp-mux, session negotiation will fail.
     */
    "require"
};

/**
 * These dictionaries describe the options that can be used to control the
 * offer/answer creation process.
 */
interface RTCOfferAnswerOptions {
    /**
     * Many codecs and systems are capable of detecting "silence" and changing
     * their behavior in this case by doing things such as not transmitting any media.
     * In many cases, such as when dealing with emergency calling or sounds other
     * than spoken voice, it is desirable to be able to turn off this behavior.
     * This option allows the application to provide information about whether
     * it wishes this type of processing enabled or disabled.
     */
    voiceActivityDetection?: boolean;
};

interface RTCAnswerOptions extends RTCOfferAnswerOptions {

};

class RTCPeerConnection {
    constructor(configuration?: RTCConfiguration);

    /**
     * The createOffer method generates a blob of SDP that contains an RFC 3264
     * offer with the supported configurations for the session, including
     * descriptions of the local MediaStreamTracks attached to this
     * RTCPeerConnection, the codec/RTP/RTCP options supported by this
     * implementation, and any candidates that have been gathered by the ICE Agent.
     * The options parameter may be supplied to provide additional control over
     * the offer generated.
     */
    createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescription>;

    /**
     * The createAnswer method generates an [SDP] answer with the supported
     * configuration for the session that is compatible with the parameters in
     * the remote configuration. Like createOffer, the returned blob contains
     * descriptions of the local MediaStreamTracks attached to this RTCPeerConnection,
     * the codec/RTP/RTCP options negotiated for this session, and any candidates
     * that have been gathered by the ICE Agent. The options parameter may be
     * supplied to provide additional control over the generated answer.
     */
    createAnswer(options?: RTCAnswerOptions): Promise<RTCSessionDescription>;

    /**
     * The setLocalDescription() method instructs the RTCPeerConnection to apply
     * the supplied RTCSessionDescriptionInit as the local description.
     */
    setLocalDescription(description: RTCSessionDescriptionInit): Promise<void>;

    /**
     * The localDescription attribute must return pendingLocalDescription if
     * it is not null and otherwise it must return currentLocalDescription.
     */
    /* readonly */ localDescription?: RTCSessionDescription;
    /**
     * The currentLocalDescription attribute represents the local
     * RTCSessionDescription that was successfully negotiated the last time
     * theRTCPeerConnection transitioned into the stable state plus any local
     * candidates that have been generated by the ICE Agent since the offer or
     * answer was created. This attribute is updated by setLocalDescription().
     *
     * The currentLocalDescription attribute must return the last value that
     * algorithms in this specification set it to, completed with any local
     * candidates that have been generated by the ICE Agent since the offer or
     * answer was created. Prior to being set, it returns null.
     */
    /* readonly */ currentLocalDescription?: RTCSessionDescription;

    /**
     * The pendingLocalDescription attribute represents a local
     * RTCSessionDescription that is in the process of being negotiated
     * plus any local candidates that have been generated by the ICE Agent
     * since the offer or answer was created. If the RTCPeerConnection is in
     * the stable state, the value is null. This attribute is updated by
     * setLocalDescription().
     *
     * The pendingLocalDescription attribute must return the last value that
     * algorithms in this specification set it to, completed with any local
     * candidates that have been generated by the ICE Agent since the offer
     * or answer was created. Prior to being set, it returns null.
     */
    /* readonly */ pendingLocalDescription?: RTCSessionDescription;

    /**
     * The setRemoteDescription() method instructs the RTCPeerConnection to apply
     * the supplied RTCSessionDescriptionInit as the remote offer or answer.
     * This API changes the local media state.
     */
    setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;

    /**
     * The remoteDescription attribute must return pendingRemoteDescription
     * if it is not null and otherwise it must return currentRemoteDescription.
     */
    /* readonly */ remoteDescription?: RTCSessionDescription;

    /**
     * The currentRemoteDescription attribute represents the last remote
     * RTCSessionDescription that was successfully negotiated the last time
     * theRTCPeerConnection transitioned into the stable state plus any remote
     * candidates that have been supplied via addIceCandidate() since the offer
     * or answer was created. This attribute is updated by setRemoteDescription().
     *
     * The currentRemoteDescription attribute must return the value that
     * algorithms in this specification set it to, completed with any remote
     * candidates that have been supplied via addIceCandidate() since the offer
     * or answer was created. Prior to being set, it returns null.
     */
    /* readonly */ currentRemoteDescription?: RTCSessionDescription;

    /**
     * The pendingRemoteDescription attribute represents a remote
     * RTCSessionDescription that is in the process of being negotiated,
     * completed with any remote candidates that have been supplied via
     * addIceCandidate() since the offer or answer was created.
     * If the RTCPeerConnection is in the stable state, the value is null.
     * This attribute is updated by setLocalDescription().
     *
     * The pendingRemoteDescription attribute must return the value that
     * algorithms in this specification set it to, completed with any remote
     * candidates that have been supplied via addIceCandidate() since the offer
     * or answer was created. Prior to being set, it returns null.
     */
    /* readonly */ pendingRemoteDescription?: RTCSessionDescription;

    /**
     * The addIceCandidate() method provides a remote candidate to the ICE Agent.
     * In addition to being added to the remote description, connectivity checks
     * will be sent to the new candidates as long as the ICE Transports setting
     * is not set to none. This call will result in a change to the connection
     * state of the ICE Agent, and may result in a change to media state if it
     * results in different connectivity being established. The only members of
     * the candidate attribute used by this method are candidate, sdpMid and
     * sdpMLineIndex; the rest are ignored.
     */
    addIceCandidate(candidate: RTCIceCandidate): Promise<void>;

    /**
     * The signalingState attribute must return the RTCPeerConnection object's
     * RTCPeerConnection signaling state.
     */
    /* readonly */ signalingState: RTCSignalingState;

    /**
     * The iceGatheringState attribute must return the gathering state of the
     * RTCPeerConnection ICE Agent.
     */
    /* readonly */ iceGatheringState: RTCIceGatheringState;

    /**
     * The iceConnectionState attribute must return the connection state of the
     * RTCPeerConnection ICE Agent.
     */
    /* readonly */ iceConnectionState: RTCIceConnectionState;

    /**
     * The connectionState attribute must return the aggregate of the states of
     * the DtlsTransports and IceTransports of the RTCPeerConnection,
     * as describe in the values of the RTCPeerConnectionState enum.
     */
    /* readonly */ connectionState: RTCPeerConnectionState;

    /**
     * This attribute indicates whether the remote peer is able to accept
     * trickled ICE candidates [TRICKLE-ICE]. The value is determined based on
     * whether a remote description indicates support for trickle ICE,
     * as defined in Section 4.1.9 of [RTCWEB-JSEP]. Prior to the completion
     * of setRemoteDescription, this value is null.
     */
    /* readonly */ canTrickleIceCandidates?: boolean;

    /**
     * Returns a RTCConfiguration object representing the current configuration
     * of this RTCPeerConnection object.
     */
    getConfiguration(): RTCConfiguration;

    /**
     * The setConfiguration method updates the ICE Agent process of gathering
     * local candidates and pinging remote candidates.
     *
     * This call may result in a change to the state of the ICE Agent, and may
     * result in a change to media state if it results in connectivity being
     * established.
     */
    setConfiguration(configuration: RTCConfiguration): void;

    /**
     * When the RTCPeerConnection close() method is invoked, the
     * user agent must run the following steps:
     *
     * 1. If the RTCPeerConnection object's RTCPeerConnection signalingState is closed,
     * 	  abort these steps.
     *
     * 2. Destroy the RTCPeerConnection ICE Agent, abruptly ending any active
     * 	  ICE processing and any active streaming, and releasing any relevant
     * 	  resources (e.g. TURN permissions).
     *
     * 3. Set the object's RTCPeerConnection signalingState to closed.
     */
    close(): void;

    /**
     * The event type of this event handler is negotiationneeded.
     */
    onnegotiationneeded: EventHandler;

    /**
     * The event type of this event handler is icecandidate.
     */
    onicecandidate: EventHandler;

    /**
     * The event type of this event handler is icecandidateerror.
     */
    onicecandidateerror: EventHandler;

    /**
     * The event type of this event handler is signalingstatechange.
     * It is called any time the RTCPeerConnection signaling state changes, i.e.,
     * from a call to setLocalDescription, a call to setRemoteDescription, or code.
     * It does not fire for the initial state change into new.
     */
    onsignalingstatechange: EventHandler;

    /**
     * The event type of this event handler is iceconnectionstatechange.
     * It is called any time the RTCPeerConnection ice connection state changes.
     */
    oniceconnectionstatechange: EventHandler;

    /**
     * The event type of this event handler is icegatheringstatechange.
     * It is called any time the RTCPeerConnection ice gathering state changes.
     */
    onicegatheringstatechange: EventHandler;

    /**
     * The event type of this event handler is connectionstatechange.
     */
    onconnectionstatechange: EventHandler;
}

enum RTCSignalingState {
    /**
     * There is no offer­answer exchange in progress. This is also the initial
     * state in which case the local and remote descriptions are empty.
     */
    "stable",
    /**
     * A local description, of type "offer", has been successfully applied.
     */
    "have-local-offer",
    /**
     * A remote description, of type "offer", has been successfully applied.
     */
    "have-remote-offer",
    /**
     * A remote description of type "offer" has been successfully applied and a
     * local description of type "pranswer" has been successfully applied.
     */
    "have-local-pranswer",
    /**
     * A local description of type "offer" has been successfully applied and a
     * remote description of type "pranswer" has been successfully applied.
     */
    "have-remote-pranswer",
    /**
     * The connection is closed.
     */
    "closed"
};

enum RTCIceGatheringState {
    /**
     * The object was just created, and no networking has occurred yet.
     */
    "new",
    /**
     * The ICE agent is in the process of gathering candidates
     * for this RTCPeerConnection.
     */
    "gathering",
    /**
     * The ICE agent has completed gathering. Events such as adding a new
     * interface or a new TURN server will cause the state to go back
     * to gathering.
     */
    "complete"
};

enum RTCPeerConnectionState {
    /**
     * Any of the RTCIceTransports or RTCDtlsTransports are in the new state
     * and none of the transports are in the connecting, checking, failed or
     * disconnected state, or all transports are in the closed state.
     */
    "new",
    /**
     * 	Any of the RTCIceTransports or RTCDtlsTransports are in the connecting
     * 	or checking state and none of them is in the failed state.
     */
    "connecting",
    /**
     * All RTCIceTransports and RTCDtlsTransports are in the connected,
     * completed or closed state and at least of them is in the connected or
     * completed state.
     */
    "connected",
    /**
     * Any of the RTCIceTransports or RTCDtlsTransports are in the disconnected
     * state and none of them are in the failed or connecting or checking state.
     */
    "disconnected",
    /**
     * Any of the RTCIceTransports or RTCDtlsTransports are in a failed state.
     */
    "failed"
};

enum RTCIceConnectionState {
    /**
     * The ICE Agent is gathering addresses and/or waiting for
     * remote candidates to be supplied.
     */
    "new",
    /**
     * The ICE Agent has received remote candidates on at least one component,
     * and is checking candidate pairs but has not yet found a connection.
     * In addition to checking, it may also still be gathering.
     */
    "checking",
    /**
     * The ICE Agent has found a usable connection for all components but is
     * still checking other candidate pairs to see if there is a better connection.
     * It may also still be gathering.
     */
    "connected",
    /**
     * The ICE Agent has finished gathering and checking and found a connection
     * for all components. Details on how the completed state in ICE is reached
     * are covered in [ICE].
     */
    "completed",
    /**
     * The ICE Agent is finished checking all candidate pairs and failed to
     * find a connection for at least one component. Connections may have been
     * found for some components.
     */
    "failed",
    /**
     * Liveness checks have failed for one or more components.
     * This is more aggressive than failed, and may trigger intermittently
     * (and resolve itself without action) on a flaky network.
     */
    "disconnected",
    /**
     * The ICE Agent has shut down and is no longer responding to STUN requests.
     */
    "closed"
};

interface RTCPeerConnectionErrorCallback {
    (error: DOMError): void
}

interface RTCSessionDescriptionCallback {
    (sdp: RTCSessionDescription): void
}

interface RTCSdpError extends DOMError {
    /**
     * The line number of an RTCSessionDescriptionInit at which
     * the error was encountered.
     */
    /* readonly */ sdpLineNumber: number;
};

/**
 * The RTCSdpType enum describes the type of an RTCSessionDescriptionInit
 * or RTCSessionDescription instance.
 */
enum RTCSdpType {
    /**
     * An RTCSdpType of offer indicates that a description must be treated as
     * an [SDP] offer.
     */
    "offer",
    /**
     * An RTCSdpType of pranswer indicates that a description must be treated
     * as an [SDP] answer, but not a final answer. A description used as an SDP
     * pranswer may be applied as a response to an SDP offer, or an update to a
     * previously sent SDP pranswer.
     */
    "pranswer",
    /**
     * An RTCSdpType of answer indicates that a description must be treated as
     * an [SDP] final answer, and the offer-answer exchange must be considered
     * complete. A description used as an SDP answer may be applied as a response
     * to an SDP offer or as an update to a previously sent SDP pranswer.
     */
    "answer",
    /**
     * An RTCSdpType of rollback indicates that a description must be treated
     * as an canceling the current SDP negotiation and moving back to the SDP
     * [SDP] offer and answer back to what it was in the previous stable state.
     * Note the local or remote SDP descriptions in the previous stable state
     * could be null if there has not yet been a successful offer-answer
     * negotiation.
     */
    "rollback"
};

interface RTCSessionDescriptionInit {
    type: RTCSdpType;
    sdp?: string;
};

class RTCSessionDescription {
    constructor();
    /**
     * The RTCSessionDescription() constructor takes a dictionary argument,
     * descriptionInitDict, whose content is used to initialize the new
     * RTCSessionDescription object. This constructor is deprecated;
     * it exists for legacy compatibility reasons only.
     */
    constructor(descriptionInitDict: RTCSessionDescriptionInit);
    type: RTCSdpType;
    sdp?: string;
};

interface RTCIceCandidate {
    /**
     * This carries the candidate-attribute as defined in section 15.1 of [ICE].
     */
    candidate: string
    /**
     * If present, this contains the identifier of the "media stream identification"
     * as defined in [RFC5888] for the media component this candidate is associated
     * with.
     */
    sdpMid?: string
    /**
     * This indicates the index (starting at zero) of the media description
     * in the SDP this candidate is associated with.
     */
    sdpMLineIndex?: number
    /**
     * A unique identifier that allows ICE to correlate candidates that appear
     * on multiple RTCIceTransports.
     */
    foundation?: string
    /**
     * The assigned priority of the candidate. This is automatically populated
     * by the browser.
     */
    priority?: number
    /**
     * The IP address of the candidate.
     */
    ip?: string
    /**
     * The protocol of the candidate (udp/tcp).
     */
    protocol?: RTCIceProtocol
    /**
     * The port of the candidate.
     */
    port?: number
    /**
     * The type of candidate.
     */
    type?: RTCIceCandidateType
    /**
     * If protocol is tcp, tcpType represents the type of TCP candidate.
     * Otherwise, tcpType is not present in the dictionary.
     */
    tcpType?: RTCIceTcpCandidateType
    /**
     * For a candidate that is derived from another, such as a relay or reflexive
     * candidate, the relatedAddress is the IP address of the candidate that it
     * is derived from. For host candidates, the relatedAddress is not present
     * in the dictionary.
     */
    relatedAddress?: string
    /**
     * For a candidate that is derived from another, such as a relay or reflexive
     * candidate, the relatedPort is the port of the candidate that it is
     * derived from. For host candidates, the relatedPort is not present in
     * the dictionary.
     */
    relatedPort?: number
}

/**
 * The RTCIceProtocol represents the protocol of the ICE candidate.
 */
enum RTCIceProtocol {
    /**
     * A UDP candidate, as described in [ICE].
     */
    "udp",
    /**
     * A TCP candidate, as described in [RFC6544].
     */
    "tcp"
};

/**
 * The RTCIceTcpCandidateType represents the type of the ICE TCP candidate,
 * as defined in [RFC6544].
 */
enum RTCIceTcpCandidateType {
    /**
     * An active TCP candidate is one for which the transport will attempt
     * to open an outbound connection but will not receive incoming connection
     * requests.
     */
    "active",
    /**
     * A passive TCP candidate is one for which the transport will receive
     * incoming connection attempts but not attempt a connection.
     */
    "passive",
    /**
     * An so candidate is one for which the transport will attempt to open a
     * connection simultaneously with its peer.
     */
    "so"
};

/**
 * The RTCIceCandidateType represents the type of the ICE candidate, as defined in [ICE].
 */
enum RTCIceCandidateType {
    /**
     * A host candidate.
     */
    "host",
    /**
     * A server reflexive candidate.
     */
    "srflx",
    /**
     * A peer reflexive candidate.
     */
    "prflx",
    /**
     * A relay candidate.
     */
    "relay"
};

interface RTCPeerConnectionIceEventInit extends EventInit {
    candidate?: RTCIceCandidate;
    url?: string;
};

class RTCPeerConnectionIceEvent extends Event {
    constructor(type: string, eventInitDict: RTCPeerConnectionIceEventInit)

    /**
     * The candidate attribute is the RTCIceCandidate object with the
     * new ICE candidate that caused the event.
     */
    /* readonly */ candidate?: RTCIceCandidate;

    /**
     * The url attribute is the STUN or TURN URL that identifies the STUN or
     * TURN server used to gather this candidate. If the candidate was not
     * gathered from a STUN or TURN server, this parameter will be set to null.
     */
    /* readonly */ url?: string;
};

interface RTCPeerConnectionIceErrorEventInit : EventInit {
     hostCandidate: string
     url: string
     errorCode: number
     statusText: USVString
};

class RTCPeerConnectionIceErrorEvent : Event {
    constructor(string: type, eventInitDict: RTCPeerConnectionIceErrorEventInit);

    /**
     * The hostCandidate attribute is the local IP address and port used to
     * communicate with the STUN or TURN server.
     */
    /* readonly */ hostCandidate: string;

    /**
     * The url attribute is the STUN or TURN URL that identifies the STUN or
     * TURN server for which the failure occurred.
     */
    /* readonly */ url: string;

    /**
     * The errorCode attribute is the numeric STUN error code returned by the
     * STUN or TURN server.
     */
    /* readonly */ errorCode: number;

    /**
     * The errorText attribute is the STUN reason text returned by the STUN
     * or TURN server.
     */
    /* readonly */ errorText: USVString;
};

enum RTCPriorityType {
    "very-low",
    "low",
    "medium",
    "high"
};

/* TODO @spanferov Class or interface */
interface RTCPeerConnection {
    /**
     * The generateCertificate function causes the user agent to create and
     * store an X.509 certificate [X509V3] and corresponding private key.
     * A handle to information is provided in the form of the RTCCertificate
     * interface. The returned RTCCertificate can be used to control the
     * certificate that is offered in the DTLS sessions established by
     * RTCPeerConnection.
     */
    generateCertificate(keygenAlgorithm: AlgorithmIdentifier): Promise<RTCCertificate>;
}

interface RTCCertificate {
    /**
     * The expires attribute indicates the date and time in milliseconds
     * relative to 1970-01-01T00:00:00Z after which the certificate will be
     * considered invalid by the browser. After this time, attempts to construct
     * an RTCPeerConnection using this certificate fail.
     */
    expires: DOMTimeStamp;
};

interface RTCPeerConnection {
    /**
     * The SCTP transport over which SCTP data is sent and received.
     * If SCTP has not been negotiated, the value is null.
     */
    /* readonly */ sctp?: RTCSctpTransport;

    /**
     * Returns a sequence of RTCRtpSender objects representing the RTP senders
     * that are currently attached to this RTCPeerConnection object.
     */
    getSenders(): RTCRtpSender[];

    /**
     * Returns a sequence of RTCRtpReceiver objects representing the RTP
     * receivers that are currently attached to this RTCPeerConnection object.
     */
    getReceivers(): RTCRtpReceiver[];

    /**
     * Returns a sequence of RTCRtpTransceiver objects representing the RTP
     * transeceivers that are currently attached to this RTCPeerConnection object.
     */
    getTransceivers(): RTCRtpTransceivers[];

    /**
     * Adds a new track to the RTCPeerConnection, and indicates that
     * it is contained in the specified MediaStreams.
     */

    addTrack(track: MediaStreamTrack , ...streams: MediaStream[]): RTCRtpSender;

    /**
     * Stops sending media from sender. The RTCRtpSender will still appear in
     * getSenders. Doing so will cause future calls to createOffer to mark the
     * media description for the corresponding transceiver as recvonly or inactive,
     * as defined in [RTCWEB-JSEP].
     */
    removeTrack(sender: RTCRtpSender): void;

    /**
     * Create a new RTCRtpTransceiver and add it to the collection of
     * transceivers that will be returned by getReceivers().
     */
    addTransceiver(trackOrKind: MediaStreamTrack | string, init: RTCRtpTransceiverInit): RTCRtpTransceiver;

    /**
     * The event type of this event handler is track.
     */
    ontrack: EventHandler;
};

class RTCRtpSender {

    /**
     * The track attribute is the track that is associated with this RTCRtpSender object.
     */
    /* readonly */ track: MediaStreamTrack;

    /**
     * The transport attribute is the transport over which media from track
     * is sent in the form of RTP packets. When BUNDLE is used,
     * many RTCRtpSender objects will share one transport and will all send
     * RTP over the same transport. When RTCP mux is used, rtcpTransport will
     * be null, and both RTP and RTCP traffic will flow over the transport
     * described by transport.
     */
    /* readonly */ transport: RTCDtlsTransport;

    /**
     * The rtcpTransport attribute is the transport over which RTCP is sent
     * and received. When BUNDLE is used, many RTCRtpSender objects will share
     * one rtcpTransport and will all send and receive RTCP over the same
     * transport. When RTCP mux is used, rtcpTransport will be null, and
     * both RTP and RTCP traffic will flow over the transport described
     * by transport.
     */
    /* readonly */ rtcpTransport?: RTCDtlsTransport;

    /**
     * The mid attribute is the value of the a=mid SDP attribute that is
     * immutably associated, via setLocalDescription, with this RTCRtpSender object.
     */
    /* readonly */ mid: string;

    /**
     * The RTCRtpSender.getCapabilities method returns the most optimist view
     * on the capabilities of the system for sending media of the given kind.
     * It does not reserve any resources, ports, or other state but is meant
     * to provide a way to discover the types of capabilities of the browser
     * including which codecs may be supported.
     */

    static getCapabilities(kind: string): RTCRtpCapabilities;

    /**
     * The setParameters method updates how track is encoded and
     * transmitted to a remote peer.
     */
    setParameters(parameters: RTCRtpParameters): void;

    /**
     * The getParameters method returns the RTCRtpSender object's current
     * parameters for how track is encoded and transmitted to a remote RTCRtpReceiver.
     * It may used with setParameters to change the parameters in the follwing way:
     */
    getParameters(): RTCRtpParameters;

    /**
     * Attempts to replace the track being sent with another track provided,
     * without renegotiation.
     */
    replaceTrack(withTrack: MediaStreamTrack): Promise<void>;
};

interface RTCRtpParameters {
    /**
     * A sequence containing parameters for RTP encodings of media.
     */
    encodings: RTCRtpEncodingParameters[];

    /**
     * A sequence containing parameters for RTP header extensions.
     */
    headerExtensions: RTCRtpHeaderExtensionParameters[];

    /**
     * Parameters used for RTCP.
     */
    rtcp: RTCRtcpParameters;

    /**
     * A sequence containing the codecs that an RTCRtpSender will choose
     * from in order to send media.
     */
    codecs: RTCRtpCodecParameters[];
};

interface RTCRtpEncodingParameters {
    /**
     * The SSRC of the RTP source stream of this encoding (non-RTX, non-FEC RTP stream). Read-only parameter.
     */
     ssrc: number;

     /**
      * The parameters used for RTX, or unset if RTX is not being used.
      */
     rtx: RTCRtxParameters;

     /**
      * The parameters used for FEC, or unset if FEC is not being used.
      */
     fec: RTCFecParameters;

     /**
      * Indicates that this encoding is actively being sent. Setting it to false
      * causes this encoding to no longer be sent. Setting it to true causes
      * this encoding to be sent.
      */
     active: boolean;

     /**
      * Indicates the priority of this encoding. It is specified in [RTCWEB-TRANSPORT], Section 4.
      */
     priority: RTCPriorityType;

     /**
      * Indicates the maximum bitrate that can be used to send this encoding.
      * The encoding may also be further constrained by other bandwidth limits
      * (such as per-transport or per-session limits) below the maximum
      * specified here.
      */
     maxBitrate: number;

     /**
      * When bandwidth is constrained and the RtpSender needs to choose
      * between degrading resolution or degrading framerate,
      * degradationPreference indicates which is prefered.
      */
     degradationPreference: RTCDegradationPreference;
};

enum RTCDegradationPreference {
    /**
     * Degrade resolution in order to maintain framerate.
     */
    "maintain-framerate",
    /**
     * Degrade framerate in order to maintain resolution.
     */
    "maintain-resolution",
    /**
     * Degrade a balance of framerate and resolution
     */
    "balanced"
};

interface RTCRtxParameters {
    ssrc: number;
};

interface RTCFecParameters {
    /**
     * The SSRC of the RTP stream for RTX.
     */
    ssrc: number;
};

interface RTCRtcpParameters {
    /**
     * The Canonical Name (CNAME) used by RTCP (e.g. in SDES messages).
     * Read-only parameter.
     */
    cname: string;

    /**
     * Whether reduced size RTCP [RFC5506] is configured (if true) or
     * compound RTCP as specified in [RFC3550] (if false). Read-only parameter.
     */
    reducedSize: boolean;
};

interface RTCRtpHeaderExtensionParameters {
    /**
     * The URI of the RTP header extension, as defined in [RFC5285].
     * Read-only parameter.
     */
    uri: string;
    /**
     * The value put in the RTP packet to identify the header extension.
     * Read-only parameter.
     */
    id: number;
    /**
     * Whether the header extension is encryted or not. Read-only parameter.
     */
    encrypted: boolean;
};

interface RTCRtpCodecParameters {
    /**
     * The RTP payload type. This value can be set in the
     * RTCRtpParameters.encodings[0].payloadType to control which codec
     * should be used to send a given encoding.
     */
     payloadType: number;

     /**
      * The codec MIME type. Valid types are listed in [IANA-RTP-2].
      */
     mimeType: string;

     /**
      * The codec clock rate expressed in Hertz.
      */
     clockRate: number;

     /**
      * The number of channels (mono=1, stereo=2).
      */
     channels: number;

     /**
      * The a=fmtp line in the SDP corresponding to the codec,
      * as defined by [RTCWEB-JSEP].
      */
     sdpFmtpLine: string;
};

interface RTCRtpCapabilities {
    /**
     * Supported codecs.
     */
    codecs: RTCRtpCodecCapability[];

    /**
     * Supported RTP header extensions.
     */
    headerExtensions: RTCRtpHeaderExtensionCapability[];
};

interface RTCRtpCodecCapability {
    /**
     * The codec MIME type. Valid types are listed in [IANA-RTP-2].
     */
    mimeType: string;
};

interface RTCRtpHeaderExtensionCapability {
    /**
     * The URI of the RTP header extension, as defined in [RFC5285].
     */
    uri: string;
};

interface RTCRtpReceiver {
    /**
     * The RTCRtpReceiver.transport attribute is the transport over which
     * media for RTCRtpReceiver.track is received in the form of RTP packets.
     * When BUNDLE is used, many RTCRtpReceiver objects will share one
     * RTCRtpReceiver.transport and will all receive RTP over the same transport.
     * When RTCP mux is used, RTCRtpReceiver.rtcpTransport will be null, and
     * both RTP and RTCP traffic will flow over RTCRtpReceiver.transport.
     */
    /* readonly */ track: MediaStreamTrack;

    /**
     * The RTCRtpReceiver.track attribute is the track that is immutably
     * associated with this RTCRtpReceiver object.
     */
    /* readonly */ transport: RTCDtlsTransport;

    /**
     * The RTCRtpReceiver.rtcpTransport attribute is the transport over which
     * RTCP is sent and received. When BUNDLE is used, many RTCRtpReceiver
     * objects will share one RTCRtpReceiver.rtcpTransport and will all send
     * and receive RTCP over the same transport. When RTCP mux is used,
     * RTCRtpReceiver.rtcpTransport will be null, and both RTP and RTCP traffic
     * will flow over RTCRtpReceiver.transport.
     */
    /* readonly */ rtcpTransport?: RTCDtlsTransport;

    /**
     * The RTCRtpReceiver.mid attribute is the value of the a=mid SDP
     * attribute that is immutably associated, via setRemoteDescription,
     * with this RTCRtpReceiver object. In the case where no a=mid attribute
     * is present in the remote description, a random value will be generated.
     */
    /* readonly */ mid: string;

    /**
     * The RTCRtpReceiver.getCapabilities method returns the most optimist
     * view on the capabilities of the system for receiving media of the given kind.
     * It does not reserve any resources, ports, or other state but is meant
     * to provide a way to discover the types of capabilities of the browser
     * including which codecs may be supported.
     */
    static getCapabilities(kind: string): RTCRtpCapabilities;

    /**
     * Returns an RTCRtpContributingSource for each unique CSRC or SSRC
     * received by this RTCRtpReceiver in the last 10 seconds.
     */
    getContributingSources(): RTCRtpContributingSource[];
};

/**
 * The RTCRtpContributingSource objects contain information about a given
 * contributing source, including the time the most recent time a packet
 * was received from the source. The browser must keep information from
 * RTP packets received in the previous 10 seconds. Each time an RTP packet
 * is received, the RTCRtpContributingSource objects are updated.
 * If the RTP packet contains CSRCs, then the RTCRtpContributingSource
 * objects corresponding to those CSRCs are updated. If the RTP packet
 * contains no CSRCs, then the RTCRtpContributingSource object corresponding
 * to the SSRC is updated.
 */
interface RTCRtpContributingSource {

    /**
     * The timestamp of type DOMHighResTimeStamp [HIGHRES-TIME], indicating
     * the time of reception of the most recent RTP packet containing the source.
     * The timestamp is defined in [HIGHRES-TIME] and corresponds to a local clock.
     */
    timestamp: DOMHighResTimeStamp;

    /**
     * The CSRC or SSRC value of the contributing source.
     */
    source: number;

    /**
     * The audio level contained in the last RTP packet received from the this
     * source. If the source was set from an SSRC, this will be the level
     * value defined in [RFC6464]. If an RFC 6464 extension header is not
     * present, the browser will compute the value as if it had come from
     * RFC 6464 and use that. If the source was set from a CSRC, this will
     * be the level value defined in [RFC6465]. RFC 6464 and 6465 define the
     * level as a integral value from 0 to -127 representing the audio level
     * in decibels relative to the loudest signal that they system could
     * possibly encode.
     */
    audioLevel?: number;
};

/**
 * The RTCRtpTransceiver interface represents a combination of an RTCRtpSender
 * and an RTCRtpReceiver that share a common mid.
 */
interface RTCRtpTransceiverInit {
    /**
     * If true, indicates that the RTCRtpTransceiver's RTCRtpSender
     * will offer to send RTP and send RTP if the remote peer accepts.
     * If false, indicates that the RTCRtpSender will not offer to send
     * RTP and will not send RTP (the direction of the media description
     * generated by createOffer will be recvonly or inactive).
     */
     send: boolean;

     /**
      * If true, indicates that the RTCRtpTransceiver's RTCRtpReceiver
      * will offer to receive RTP and receive RTP if the remote peer accepts.
      * If false, indicates that the RTCRtpReceiver will not offer to receive
      * RTP and will not receive RTP (the direction of the media description
      * generated by createOffer will be sendonly or inactive).
      */
     receive: boolean;

     /**
      * When the remote PeerConnection's ontrack event fires corresponding
      * to the RTCRtpReceiver being added, these are the streams that will
      * be put in the event.
      */
     streams: MediaStream[];
};

interface RTCRtpTransceiver {
    /**
     * The RTCRtpTransceiver.mid attribute is the mid value from the local
     * description corresponding to this RTCRtpTransceiver.
     * If this RTCRtpTranceiver has not yet been added to the local description,
     * it is the mid value that will be added to the next value returned by
     * PeerConnection.createOffer.
     */
    mid: string;

    /**
     * The RTCRtpTransceiver.sender attribute is the RTCRtpSender corresponding
     * to the RTP media that may be sent with mid = RTCRtpTransceiver.mid.
     */
    sender: RTCRtpSender;

    /**
     * The RTCRtpTransceiver.receiver attribute is the RTCRtpReceiver
     * corresponding to the RTP media that may be received with mid =
     * RTCRtpTransceiver.mid.
     */
    receiver: RTCRtpReceiver;

    /**
     * The RTCRtpTransceiver.stopped attribute indicates that the sender of
     * this transceiver will no longer send, and that the receiver will no
     * longer receive. It is true if either RTCRtpTransceiver.stop has been
     * called or if setting the local or remote description has caused the
     * RTCRtpReceiver to be stopped.
     */
    stopped: boolean;

    /**
     * The RTCRtpTransceiver.stop method stops the RTCRtpTransceiver.
     * The sender of this transceiver will no longer send, and that
     * the receiver will no longer receive.
     */
    stop(): void;

    /**
     * The setCodecPreferences method overrides the default codec preferences
     * used by the user agent. When generating a session description using
     * either createOffer or createAnswer, the user agent must use the indicated
     * codecs, in the order specified in the codecs argument, for the media
     * section corresponding to this RTCRtpTransceiver. Note that calls to
     * createAnswer will use only the common subset of these codecs and the
     * codecs that appear in the offer.
     */
    setCodecPreferences(codecs: RTCRtpCodecCapability[]): void;
};

/**
 * The RTCDtlsTransport interface allows an application access to information
 * about the Datagram Transport Layer Security (DTLS) transport over which
 * RTP and RTCP packets are sent and received by RTCRtpSender and RTCRtpReceiver
 * objects, as well other data such as SCTP packets sent and received by data
 * channels. In particular, DTLS adds security to an underlying transport, and
 * the RTCDtlsTransport interface allows access to information about the
 * underlying transport and the security added.
 */
interface RTCDtlsTransport {
    /**
     * [The RTCDtlsTransport.transport attribute is the underlying transport
     * that is used to send and receive packets. The underlying transport may
     * not be shared between multiple active RTCDtlsTransport objects.
     */
    transport: RTCIceTransport;

    /**
     * The state attribute must return the state of the transport.
     */
    state: RTCDtlsTransportState;

    /**
     * An array containing the remote certificates in use by the remote side.
     */
    getRemoteCertificates(): ArrayBuffer[];

    /**
     * This event handler, of event handler event type statechange,
     * must be fired any time the RTCDtlsTransport state changes.
     */
    onstatechange: EventHandler;
};

enum RTCDtlsTransportState {
    /**
     * DTLS has not started negotiating yet.
     */
    "new",
    /**
     * DTLS is in the process of negotiating a secure connection.
     */
    "connecting",
    /**
     * DTLS has completed negotiation of a secure connection.
     */
    "connected",
    /**
     * The transport has been closed.
     */
    "closed",
    /**
     * The transport has failed as the result of an error
     * (such as a failure to validate the remote fingerprint).
     */
    "failed"
};

interface RTCIceTransport {
    /**
     * The role attribute must return the ICE role of the transport.
     */
    role: RTCIceRole;

    /**
     * The component attribute must return the ICE component of the transport.
     */
    component: RTCIceComponent;

    /**
     * The state attribute must return the state of the transport.
     */
    state: RTCIceConnectionState;

    /**
     * The gathering state attribute must return the gathering state of the transport.
     */
    gatheringState: RTCIceGatheringState;

    /**
     * An array containing the local ICE candiates gathered for
     * this RTCIceTransport and sent in onicecandidate
     */
    getLocalCandidates(): RTCIceCandidate[];

    /**
     * An array containing the remote ICE candiates received by this
     * RTCIceTransport via addIceCandidate()
     */
    getRemoteCandidates(): RTCIceCandidate[]

    /**
     * Returns the selected candidate pair on which packets are sent,
     * or NULL if there is no such pair.
     */
    getSelectedCandidatePair(): RTCIceCandidatePair;

    /**
     * Returns the local ICE parameters received by this RTCIceTransport via
     * setLocalDescription(), or null if the parameters have not yet been received.
     */
    getLocalParameters(): RTCIceParameters;

    /**
     * Returns the remote ICE parameters received by this RTCIceTransport
     * via setRemoteDescription() or null if the parameters have not yet been received.
     */
    getRemoteParameters(): RTCIceParameters;

    /**
     * This event handler, of event handler event type statechange,
     * must be fired any time the RTCIceTransport state changes.
     */
    onstatechange: EventHandler;

    /**
     * This event handler, of event handler event type gatheringstatechange,
     * must be fired any time the RTCIceTransportgathering state changes.
     */
    ongatheringstatechange: EventHandler;

    /**
     * This event handler, of event handler event type selectedcandidatepairchange,
     * must be fired any time the RTCIceTransport's selected candidate pair changes.
     */
    onselectedcandidatepairchange: EventHandler;
};

interface RTCIceParameters {
    /**
     * The ICE username fragment as defined in [ICE], Section 7.1.2.3.
     * @type {string}
     */
     usernameFragment: string;
     /**
      * The ICE password as defined in [ICE], Section 7.1.2.3.
      */
     password: string;
};

interface RTCIceCandidatePair {
    /**
     * The local ICE candidate.
     */
    local: RTCIceCandidate;
    /**
     * The remote ICE candidate.
     */
    remote: RTCIceCandidate;
};

enum RTCIceRole {
    /**
     * A controlling agent as defined by [RFC7065], Section 3.
     */
    "controlling",
    /**
     * A controlled agent as defined by [RFC7065], Section 3.
     */
    "controlled"
};

enum RTCIceComponent {
    /**
     * Defined by [ICE], Section 4.1.1.1 as "1".
     */
    "RTP",
    /**
     * Defined by [ICE], Section 4.1.1.1 as "2".
     */
    "RTCP"
};

/**
 * The RTCSctpTransport interface allows an application access to information
 * about the SCTP data channels tied to a particular SCTP association.
 */
interface RTCSctpTransport {
    /**
     * The transport over which all SCTP packets for data channels will be
     * sent and received.
     */
    transport: RTCDtlsTransport;

    /**
     * The maximum size of data that can be passed to
     * RTCDataChannel's send() method.
     */
    maxMessageSize: number;
};

interface RTCTrackEventInit extends EventInit {
     receiver: RTCRtpReceiver;
     track: MediaStreamTrack;
     streams: MediaStream[];
};

class RTCTrackEvent extends Event {
    constructor(type: string, eventInitDict: RTCTrackEventInit);

    /**
     * The receiver attribute represents the RTCRtpReceiver object
     * associated with the event.
     */
    receiver: RTCRtpReceiver;

    /**
     * The RTCTrackEvent.track attribute represents the MediaStreamTrack
     * object that is associated with the RTCRtpReceiver identified by receiver.
     */
    track: MediaStreamTrack;

    /**
     * The streams attribute returns an array of MediaStream objects
     * representing the MediaStreams that this event's track is a part of.
     */
    streams: MediaStream[];
};

interface RTCPeerConnection {
    /**
     * Creates a new RTCDataChannel object with the given label.
     * The RTCDataChannelInit dictionary can be used to configure
     * properties of the underlying channel such as data reliability.
     */
    createDataChannel(label: string, dataChannelDict?: RTCDataChannelInit): RTCDataChannel;

    /**
     * The event type of this event handler is datachannel.
     */
    ondatachannel: EventHandler;
};

interface RTCDataChannelInit {

    /**
     * If set to false, data is allowed to be delivered out of order.
     * The default value of true, guarantees that data will be delivered in order.
     */
    ordered: boolean

    /**
     * Limits the time during which the channel will transmit or retransmit
     * data if not acknowledged. This value may be clamped if it exceeds the
     * maximum value supported by the user agent.
     */
    maxPacketLifeTime: number

    /**
     * Limits the number of times a channel will retransmit data if not
     * successfully delivered. This value may be clamped if it exceeds
     * the maximum value supported by the user agent.
     */
    maxRetransmits: number

    /**
     * Subprotocol name used for this channel.
     */
    protocol: string;

    /**
     * The default value of false tells the user agent to announce the channel
     * in-band and instruct the other peer to dispatch a corresponding
     * RTCDataChannel object. If set to true, it is up to the application
     * to negotiate the channel and create a RTCDataChannel object with the
     * same id at the other peer.
     */
    negotiated: boolean;

    /**
     * Overrides the default selection of id for this channel.
     */
    id: number;
};

interface RTCDataChannel extends EventTarget {
    /**
     * The RTCDataChannel.label attribute represents a label that can be
     * used to distinguish this RTCDataChannel object from other RTCDataChannel
     * objects. Scripts are allowed to create multiple RTCDataChannel objects
     * with the same label. The attribute must return the value to which it
     * was set when the RTCDataChannel object was created.
     */
    label: string;

    /**
     * The RTCDataChannel.ordered attribute returns true if the RTCDataChannel
     * is ordered, and false if other of order delivery is allowed.
     * The attribute must be initialized to true by default and must return
     * the value to which it was set when the RTCDataChannel was created.
     */
    ordered: boolean;

    /**
     * The RTCDataChannel.maxPacketLifeTime attribute returns the length of
     * the time window (in milliseconds) during which transmissions and
     * retransmissions may occur in unreliable mode, or null if unset.
     * The attribute must be initialized to null by default and must
     * return the value to which it was set when the RTCDataChannel was created.
     */
    maxPacketLifeTime: number;

    /**
     * The RTCDataChannel.maxRetransmits attribute returns the maximum number
     * of retransmissions that are attempted in unreliable mode, or null if
     * unset. The attribute must be initialized to null by default and must
     * return the value to which it was set when the RTCDataChannel was created.
     */
    maxRetransmits: number;

    /**
     * The RTCDataChannel.protocol attribute returns the name of the
     * sub-protocol used with this RTCDataChannel if any, or the empty
     * string otherwise. The attribute must be initialized to the empty
     * string by default and must return the value to which it was set
     * when the RTCDataChannel was created.
     */
    protocol: string;

    /**
     * The RTCDataChannel.negotiated attribute returns true if this
     * RTCDataChannel was negotiated by the application, or false otherwise.
     * The attribute must be initialized to false by default and must return
     * the value to which it was set when the RTCDataChannel was created.
     */
    negotiated: boolean;

    /**
     * The RTCDataChannel.id attribute returns the id for this RTCDataChannel.
     * The id was either assigned by the user agent at channel creation time or
     * selected by the script. The attribute must return the value to which it
     * was set when the RTCDataChannel was created.
     */
    id: number;

    /**
     * The RTCDataChannel.readyState attribute represents the state of the
     * RTCDataChannel object. It must return the value to which the user
     * agent last set it (as defined by the processing model algorithms).
     */
    readyState: RTCDataChannelState;

    /**
     * The bufferedAmount attribute must return the number of bytes of
     * application data (UTF-8 text and binary data) that have been queued
     * using send() but that, as of the last time the event loop started
     * executing a task, had not yet been transmitted to the network.
     * (This thus includes any text sent during the execution of the
     * current task, regardless of whether the user agent is able to
     * transmit text asynchronously with script execution.) This does
     * not include framing overhead incurred by the protocol, or
     * buffering done by the operating system or network hardware.
     * If the channel is closed, this attribute's value will only
     * increase with each call to the send() method (the attribute
     * does not reset to zero once the channel closes).
     */
    bufferedAmount: number;

    /**
     * The bufferedAmountLowThreshold attribute sets the threshold at which
     * the bufferedAmount is considered to be low. When the bufferedAmount
     * decreases from above this threshold to equal or below it, the
     * bufferedamountlow event fires. The bufferedAmountLowThreshold is
     * initially zero on each new RTCDataChannel, but the application
     * may change its value at any time.
     */
    bufferedAmountLowThreshold: number;

    /**
     * The event type of this event handler is open.
     */
    onopen: EventHandler;

    /**
     * The event type of this event handler is bufferedamountlow.
     */
    onbufferedamountlow: EventHandler;

    /**
     * The event type of this event handler is error.
     */
    onerror: EventHandler;

    /**
     * The event type of this event handler is close.
     */
    onclose: EventHandler;

    /**
     * Closes the RTCDataChannel. It may be called regardless of whether the
     * RTCDataChannel object was created by this peer or the remote peer.
     */
    close(): void;

    /**
     * The event type of this event handler is message.
     */
    onmessage: EventHandler;

    /**
     * The binaryType attribute must, on getting, return the value to which
     * it was last set. On setting, the user agent must set the IDL attribute
     * to the new value. When a RTCDataChannel object is created, the binaryType
     * attribute must be initialized to the string "blob".
     */
    binaryType: string;

    /**
     * Run the steps described by the send() algorithm with argument
     * type string object.
     */
    send(data: USVString): void;

    /**
     * Run the steps described by the send() algorithm with argument
     * type Blob object.
     */
    send(data: Blob): void;

    /**
     * Run the steps described by the send() algorithm with argument
     * type ArrayBuffer object.
     */
    send(data: ArrayBuffer): void;

    /**
     * Run the steps described by the send() algorithm with argument
     * type ArrayBufferView object.
     */
    send(data: ArrayBufferView): void;
};

enum RTCDataChannelState {
    /**
     * The user agent is attempting to establish the underlying data transport.
     * This is the initial state of a RTCDataChannel object created with
     * createDataChannel().
     */
    "connecting",
    "open",
    "closing",
    "closed"
};
