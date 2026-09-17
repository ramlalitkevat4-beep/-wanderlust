module.exports = function flash() {
    return function flashMiddleware(req, res, next) {
        req.flash = function flashMessage(type, message) {
            const messages = req.session.flash = req.session.flash || {};

            if (type && message !== undefined) {
                if (Array.isArray(message)) {
                    messages[type] = (messages[type] || []).concat(message);
                    return messages[type].length;
                }

                messages[type] = messages[type] || [];
                messages[type].push(message);
                return messages[type].length;
            }

            if (type) {
                const typeMessages = messages[type] || [];
                delete messages[type];
                return typeMessages;
            }

            req.session.flash = {};
            return messages;
        };

        next();
    };
};